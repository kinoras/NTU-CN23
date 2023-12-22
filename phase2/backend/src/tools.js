import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs/promises'
import { getAudioDurationInSeconds } from 'get-audio-duration'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import path from 'path'

// General

export const exit = (errorString) => {
    console.error(errorString)
    process.exit(1)
}

export const errorMessage = (errorCode, error) => {
    if (typeof errorCode !== 'number' || isNaN(errorCode)) {
        return { status: 500, message: 'error', error: errorCode }
    } else {
        const status = Math.floor(errorCode / 10)
        if (status === 500 && error) console.log(error)
        return { status, message: 'error', error: errorCode }
    }
}

// Token

export const decodeToken = (token) => {
    try {
        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET)
        return { valid: true, userId, _id: new mongoose.Types.ObjectId(userId) }
    } catch ({ message }) {
        return { valid: false, message }
    }
}

// HTTP request

const statusList = {
    200: 'OK',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    422: 'Unprocessable Content',
    429: 'Too Many Requests',
    500: 'Internal Server Error'
}

const parseHeader = (headerStrings) => {
    return headerStrings.map((s) => s.split(': ')).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
}

const parseQueryString = (path) => {
    return [...new URLSearchParams(path?.split('?')[1])].reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
}

const parseBody = (bodyString) => {
    try {
        return JSON.parse(bodyString)
    } catch {
        return null
    }
}

const formStatusLine = (statusCode) => {
    return `HTTP/1.1 ${statusCode} ${statusList[statusCode]}`
}

export const bodyLength = (body) => {
    const index = body.indexOf('\r\n\r\n')
    return index !== -1 ? Buffer.byteLength(body, 'utf8') - (index + '\r\n\r\n'.length) : -1
}

export const parseRequest = (requestString) => {
    try {
        const [meta, bodyString] = requestString.split('\r\n\r\n', 2)
        const [rline, ...headerStrings] = meta.split('\r\n')
        const [method, path, protocol] = rline.split(' ')
        const headers = parseHeader(headerStrings)
        return {
            status: 'success',
            method,
            path: path?.split('?')[0],
            query: parseQueryString(path),
            protocol,
            headers,
            body: parseBody(bodyString),
            token: headers?.Authorization?.replace('Bearer ', '')
        }
    } catch (err) {
        console.log(err)
        return {
            status: 'error',
            method: null,
            path: null,
            query: {},
            protocol: null,
            headers: {},
            body: null,
            token: null
        }
    }
}

export const formResponse = {
    api: (statusCode = 500, responseData) => {
        const responseBody = JSON.stringify(responseData)
        return [
            formStatusLine(statusCode),
            'Access-Control-Allow-Origin: *',
            'Connection: keep-alive',
            `Content-Type: application/json`,
            `Content-Length: ${Buffer.from(responseBody).length}`,
            '',
            `${responseBody}`
        ].join('\r\n')
    },
    mediaHeader: (statusCode = 500, type, content) => {
        return [
            formStatusLine(statusCode),
            'Access-Control-Allow-Origin: *',
            'Accept-Ranges: bytes',
            'Connection: keep-alive',
            `Content-Type: ${type}`,
            `Content-Length: ${Buffer.from(content).length}`,
            '',
            ''
        ].join('\r\n')
    },
    options: () => {
        return [
            formStatusLine(200),
            'Allow: OPTIONS, GET, POST, PUT, PATCH, DELETE',
            'Access-Control-Allow-Origin: *',
            'Access-Control-Allow-Headers: Content-Type, Authorization',
            'Access-Control-Allow-Methods: *',
            'Content-Length: 0',
            '',
            ''
        ].join('\r\n')
    }
}

export const getContentType = (ext) => {
    switch (ext) {
        case '.html':
            return 'text/html'
        case '.css':
            return 'text/css'
        case '.js':
            return 'text/javascript'
        case '.png':
            return 'image/png'
        case '.jpg':
            return 'image/jpeg'
        case '.mp3':
            return 'audio/mpeg'
        default:
            return 'application/octet-stream'
    }
}

// Video processing

export const convertHls = async (filename, height) => {
    return new Promise((resolve, reject) => {
        const objectId = new mongoose.Types.ObjectId()
        const width = Math.floor((height / 9) * 16)
        const srcPath = path.join(__dirname, `../public/queue/${filename}`)
        const destDir = path.join(__dirname, `../public/video`)
        const destFile = path.join(destDir, `${objectId}-%04d.ts`)
        ffmpeg.ffprobe(srcPath, (err, metadata) => {
            const duration = metadata?.format?.duration
            if (err) reject(err)
            ffmpeg(srcPath, { timeout: 432000 })
                .addOptions([
                    '-profile:v baseline',
                    '-level 3.0',
                    `-s ${width}x${height}`,
                    '-start_number 0',
                    '-hls_time 10',
                    '-hls_list_size 0',
                    `-hls_segment_filename ${destFile}`,
                    '-f hls'
                ])
                .output(path.join(destDir, `${objectId}.m3u8`))
                .on('end', () => resolve({ _id: objectId, duration }))
                .on('error', (err) => reject(err))
                .run()
        })
    })
}

// Audio processing

export const moveAudio = async (filename) => {
    const objectId = new mongoose.Types.ObjectId()
    const srcPath = path.join(__dirname, `../public/queue/${filename}`)
    const destDir = path.join(__dirname, `../public/audio/${objectId}.mp3`)
    await fs.copyFile(srcPath, destDir)
    const duration = await getAudioDurationInSeconds(destDir)
    return { _id: objectId, duration }
}
