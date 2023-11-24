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
