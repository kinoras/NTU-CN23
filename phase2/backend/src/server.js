import net from 'net'
import router from './routes'

import { parseRequest, formResponse, formOptionsResponse } from './tools'

const server = net.createServer((socket) => {
    console.log('Client connected')

    socket.on('data', async (data) => {
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
