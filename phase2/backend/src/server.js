import { finder, staticHolder } from './finder'
import router from './routes'
import { bodyLength, exit, formResponse, parseRequest } from './tools'
import dotenv from 'dotenv'
import fs from 'fs'
import mongoose from 'mongoose'
import net from 'net'
import path from 'path'
import tls from 'tls'

/* Environment config */
dotenv.config()

/* Environment check */
if (!process.env.MONGO_URL) {
    exit('Missing MONGO_URL!')
}

// openssl genrsa -out private-key.pem 1024
// openssl req -new -key private-key.pem -out csr.pem
// openssl x509 -req -in csr.pem -signkey private-key.pem -out public-cert.pem

const requestSolver = async (requestData, socket) => {
    const { method, path, token, query, body, msince } = parseRequest(requestData)
    if (method === 'OPTIONS') {
        // Preflight request
        socket.write(formResponse.options())
    } else if (path?.startsWith('/api/')) {
        // API request
        const { status, ...response } = (await router({ method, path, token, query, body })) ?? {}
        socket.write(formResponse.api(status, response))
    } else {
        // Media request
        const { status, type, content, mtime, ...response } = path?.startsWith('/media/')
            ? await finder({ method, path, msince })
            : await staticHolder({ method, path })
        if (status === 200) {
            socket.write(formResponse.mediaHeader(status, type, content, mtime))
            socket.write(content)
        } else {
            socket.write(formResponse.api(status, response))
        }
    }
}

if (process.env.MODE === 'DEPLOY' && (!process.env.SSL_KEY || !process.env.SSL_CERT)) {
    exit('Missing SSL_KEY or SSL_CERT!')
}

/* Socket server */
const server =
    process.env.MODE === 'DEPLOY'
        ? tls.createServer(
            {
                key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY)),
                cert: fs.readFileSync(path.join(__dirname, process.env.SSL_CERT))
            },
            (socket) => {
                let requestData = ''
                let requestLength = 0
                socket.on('data', async (data) => {
                    requestData += data.toString()
                    if (requestData.includes('\r\n\r\n')) {
                        const match = requestData.match(/Content-Length: (\d+)/)
                        requestLength = match ? parseInt(match[1], 10) : 0
                    }
                    if (bodyLength(requestData) >= requestLength) {
                        await requestSolver(requestData, socket)
                        requestData = ''
                        requestLength = 0
                    }
                })
                socket.on('error', (error) => console.log(error))
            }
        )
        : net.createServer((socket) => {
            socket.on('data', async (data) => {
                await requestSolver(data.toString(), socket)
            })
            socket.on('error', (error) => console.log(error))
        })

/* database connection */
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL)

/* start server */
const mongo = mongoose.connection
const port = process.env.PORT || 4000
mongo.on('error', (error) => exit('Mongoose Connection Error: ' + error))
mongo.once('open', () => {
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
})
