import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'

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
    return [...new URLSearchParams(path.split('?')[1])].reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
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

export const parseRequest = (requestString) => {
    try {
        const [meta, bodyString] = requestString.split('\r\n\r\n', 2)
        const [rline, ...headerStrings] = meta.split('\r\n')
        const [method, path, protocol] = rline.split(' ')
        const headers = parseHeader(headerStrings)
        return {
            status: 'success',
            method,
            path: path.split('?')[0],
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

export const formResponse = (statusCode = 200, responseData) => {
    const responseBody = JSON.stringify(responseData)
    return [
        formStatusLine(statusCode),
        'Access-Control-Allow-Origin: *',
        `Content-Type: application/json`,
        `Content-Length: ${Buffer.from(responseBody).length}`,
        '',
        `${responseBody}`
    ].join('\r\n')
}

export const formOptionsResponse = () => {
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

// Video processing

export const convertHls = async (filename, height) => {
    return new Promise((resolve, reject) => {
        const objectId = new mongoose.Types.ObjectId()
        const width = Math.floor((height / 9) * 16)
        const srcPath = path.join(__dirname, `../public/queue/${filename}`)
        const destPath = path.join(__dirname, `../public/video/${objectId}.m3u8`)
        ffmpeg(srcPath, { timeout: 432000 })
            .addOptions([
                '-profile:v baseline',
                '-level 3.0',
                `-s ${width}x${height}`,
                '-start_number 0',
                '-hls_time 10',
                '-hls_list_size 0',
                '-f hls'
            ])
            .output(destPath)
            .on('end', () => resolve(objectId))
            .on('error', (err) => reject(err))
            .run()
    })
}
