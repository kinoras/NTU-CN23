import { errorMessage, getContentType } from '../tools'
import dayjs from 'dayjs'
import fs from 'fs/promises'
import path from 'path'
import { URL } from 'url'

const removeHash = (path) => {
    const parsedUrl = new URL(path, 'http://localhost')
    parsedUrl.hash = ''
    return parsedUrl.toString().replace('http://localhost', '')
}

export const finder = async ({ method, path: _path = '', msince }) => {
    try {
        // Check method
        if (method !== 'GET') {
            return errorMessage(4051)
        }

        if (!_path) {
            return errorMessage(4049)
        }

        // Check path
        const [category, name] = _path?.replace('/media/', '')?.split('/', 2)
        if (!category || !name || !['video', 'audio', 'image'].includes(category)) {
            return errorMessage(4221)
        }

        // Get file
        const filePath = path.join(__dirname, '../../public', category, name)
        const mtime = new Date((await fs.stat(filePath))?.mtime).toUTCString()
        if (!msince || dayjs(msince).isBefore(dayjs(mtime))) {
            const content = await fs.readFile(filePath)
            const type = getContentType(path.extname(name)) ?? 'text/plain'
            return { status: 200, type, content, mtime }
        } else {
            return { status: 304, mtime }
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            return errorMessage(4049)
        } else {
            return errorMessage(5001)
        }
    }
}

export const staticHolder = async ({ method, path: _path = '', msince }) => {
    try {
        // Check method
        if (method !== 'GET') {
            return errorMessage(4051)
        }

        if (!_path) {
            return errorMessage(4049)
        }

        const pathname = removeHash(_path)

        const filePath = path.join(__dirname, '../../../frontend/build', pathname === '/' ? '/index.html' : pathname)
        const mtime = new Date((await fs.stat(filePath))?.mtime).toUTCString()
        if (!msince || dayjs(msince).isBefore(dayjs(mtime))) {
            const content = await fs.readFile(filePath)
            const type = getContentType(path.extname(filePath)) ?? 'text/plain'
            return { status: 200, type, content, mtime }
        } else {
            return { status: 304, mtime }
        }
    } catch (error) {
        console.log(error)
        if (error.code === 'ENOENT') {
            return errorMessage(4049)
        } else {
            return errorMessage(5001)
        }
    }
}

export default finder
