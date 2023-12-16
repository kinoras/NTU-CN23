import Subscription from '../models/subscription'
import Video from '../models/video'
import { convertHls, errorMessage } from '../tools'
import fs from 'fs/promises'
import mongoose from 'mongoose'
import path from 'path'

export const getVideo = async ({ videoId }, _, _id) => {
    try {
        if (!videoId) {
            return errorMessage(4221)
        }
        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return errorMessage(4044)
        }
        const video = await Video.findOne({ _id: new mongoose.Types.ObjectId(videoId) }).populate('creator')
        if (!video) {
            return errorMessage(4044)
        }
        const {
            title,
            description,
            createdAt,
            creator: { _id: creatorId, stuid, email, name, avatar }
        } = video
        const subscribed = !!(_id && (await Subscription.exists({ creator: creatorId, subscriber: _id })))
        return {
            status: 200,
            video: {
                title,
                description,
                createdAt,
                creator: { stuid, email, name, avatar, subscribed },
                playlist: path.join('/media/video', `${videoId}.m3u8`),
                thumbnail: path.join('/media/image', `${videoId}.png`)
            }
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}

export const createVideo = async ({ title, description, filename, thumbnail, size = 720 }, _, creator) => {
    try {
        const { _id, duration } = await convertHls(filename, size)
        await new Video({ _id, title, description, duration, creator }).save()
        await fs.copyFile(
            path.join(__dirname, `../../public/queue/${thumbnail}`),
            path.join(__dirname, `../../public/image/${_id}.png`)
        )
        return {
            status: 200,
            message: 'success',
            video: { _id, duration }
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}
