import Podcast from '../models/podcast'
import Subscription from '../models/subscription'
import { errorMessage, moveAudio } from '../tools'
import mongoose from 'mongoose'
import path from 'path'

export const getPodcast = async ({ podcastId }, _, _id) => {
    try {
        if (!podcastId) {
            return errorMessage(4221)
        }

        if (!mongoose.Types.ObjectId.isValid(podcastId)) {
            return errorMessage(4046)
        }

        const podcast = await Podcast.findOne({ _id: new mongoose.Types.ObjectId(podcastId) }).populate('creator')

        if (!podcast) {
            return errorMessage(4046)
        }

        const {
            title,
            description,
            duration,
            createdAt,
            creator: { _id: creatorId, stuid, email, name, avatar }
        } = podcast

        const subscribed = !!(_id && (await Subscription.exists({ creator: creatorId, subscriber: _id })))

        return {
            status: 200,
            podcast: {
                title,
                description,
                duration,
                createdAt,
                creator: { stuid, email, name, avatar, subscribed },
                thumbnail: path.join('/media/image', `${podcastId}.png`),
                audio: path.join('/media/audio', `${podcastId}.mp3`)
            }
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}

export const createPodcast = async ({ title, description, filename }, _, creator) => {
    try {
        const { _id, duration } = await moveAudio(filename)
        await new Podcast({ _id, title, description, duration, creator }).save()
        return {
            status: 200,
            message: 'success',
            podcast: { _id, duration }
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}
