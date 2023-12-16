import Podcast from '../models/podcast'
import Video from '../models/video'
import { errorMessage } from '../tools'
import path from 'path'

export const getSuggestions = async () => {
    try {
        const videoList = await Video.find().sort({ createdAt: -1 }).populate('creator')
        const podcastList = await Podcast.find().sort({ createdAt: -1 }).populate('creator')
        return {
            status: 200,
            videos: videoList.map(({ _id, title, creator: { stuid, name, avatar }, duration, createdAt }) => ({
                _id,
                title,
                creator: { stuid, name, avatar },
                duration,
                thumbnail: path.join('/media/image', `${_id}.png`),
                createdAt
            })),
            podcasts: podcastList.map(
                ({ _id, title, description, creator: { stuid, name, avatar }, duration, createdAt }) => ({
                    _id,
                    title,
                    description,
                    creator: { stuid, name, avatar },
                    duration,
                    thumbnail: path.join('/media/image', `${_id}.png`),
                    createdAt
                })
            )
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}
