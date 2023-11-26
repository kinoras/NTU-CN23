import net from 'net'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import router from './routes'
import { exit, parseRequest, formResponse, formOptionsResponse } from './tools'

/* environment config */
dotenv.config()

/* environment check */
if (!process.env.MONGO_URL) exit('Missing MONGO_URL!')

/* socket server */
const server = net.createServer((socket) => {
    // console.log('Client connected')

    socket.on('data', async (data) => {
        const { method, path, token, query, body } = parseRequest(data.toString())

        if (method === 'OPTIONS') {
            socket.write(formOptionsResponse())
        } else {
            const { status, ...respond } = (await router({ method, path, token, query, body })) ?? {}
            socket.write(formResponse(status ?? 500, respond))
        }
        socket.end()
    })

    // socket.on('end', () => console.log('Client disconnected'))
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
