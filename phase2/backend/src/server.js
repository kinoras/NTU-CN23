import net from 'net'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import router from './routes'
import finder from './finder'
import { exit, parseRequest, formResponse } from './tools'

/* Environment config */
dotenv.config()

/* Environment check */
if (!process.env.MONGO_URL) exit('Missing MONGO_URL!')

/* Socket server */
const server = net.createServer((socket) => {
    socket.on('data', async (data) => {
        const { method, path, token, query, body } = parseRequest(data.toString())

        if (method === 'OPTIONS') {
            // Preflight request
            socket.write(formResponse.options())
        } else if (path?.startsWith('/media/')) {
            // Media request
            const { status, type, content, ...response } = await finder({ method, path })
            if (status === 200) {
                socket.write(formResponse.mediaHeader(status, type, content))
                socket.write(content)
            } else {
                socket.write(formResponse.api(status, response))
            }
        } else {
            //
            const { status, ...response } = (await router({ method, path, token, query, body })) ?? {}
            socket.write(formResponse.api(status, response))
        }
        // socket.end()
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
