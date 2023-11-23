// Functions

const parseHeader = (headerStrings) => {
    return headerStrings
        .map((s) => s.split(': '))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
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
