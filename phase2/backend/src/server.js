import net from 'net'
import router from './routes'

import { parseRequest, formResponse, formOptionsResponse } from './tools'

const server = net.createServer((socket) => {
    console.log('Client connected')

    socket.on('data', async (data) => {
        const { method, path, token, query, body } = parseRequest(data.toString())

        if (method === 'OPTIONS') {
            socket.write(formOptionsResponse())
        } else {
            const { status = 500, ...respondData } = await router({ method, path, token, query, body })
            socket.write(formResponse(status, respondData))
            console.log(parseRequest(data.toString()))
        }
        // socket.end()
    })

    socket.on('end', () => {
        console.log('Client disconnected')
    })

    socket.on('error', (error) => {
        console.log(error)
    })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})