import { errorMessage, convertHls } from '../tools'

import Video from '../models/video'

export const createVideo = async ({ title, description, filename }, _, creator) => {
    try {
        const _id = await convertHls(filename, 720)
        await new Video({ _id, title, description, creator }).save()
        return {
            status: 200,
            message: 'success',
            videoId: _id
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}
