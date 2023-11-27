import { errorMessage } from '../tools'
import { promises as fs } from 'fs'
import path from 'path'

const typeList = {
    video: 'application/octet-stream',
    audio: 'audio/mpeg',
    image: 'image/png'
}

const finder = async ({ method, path: _path = '' }) => {
    try {
        // Check method
        if (method !== 'GET') {
            return errorMessage(4051)
        }

        // Check path
        const [category, name] = _path?.replace('/media/', '')?.split('/', 2)
        if (!category || !name || !['video', 'audio'].includes(category)) {
            return errorMessage(4221)
        }

        // Get file
        const content = await fs.readFile(path.join(__dirname, '../../public', category, name))
        const type = typeList[category] ?? 'text/plain'
        return { status: 200, type, content }
    } catch (error) {
        if (error.code === 'ENOENT') {
            return errorMessage(4049)
        } else {
            return errorMessage(5001)
        }
    }
}

export default finder
