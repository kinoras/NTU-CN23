import Podcast from '../models/podcast'
import Subscription from '../models/subscription'
import { errorMessage, moveAudio } from '../tools'
import mongoose from 'mongoose'
import path from 'path'

export const createPodcast = async ({ title, filename }, _, creator) => {
    try {
        const { _id, duration } = await moveAudio(filename)
        await new Podcast({ _id, title, duration, creator }).save()
        return {
            status: 200,
            message: 'success',
            podcast: { _id, duration }
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}
