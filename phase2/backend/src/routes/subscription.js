import Podcast from '../models/podcast'
import Subscription from '../models/subscription'
import User from '../models/user'
import Video from '../models/video'
import { errorMessage } from '../tools'
import path from 'path'

export const getSubscriptions = async (_, __, _id) => {
    try {
        const subsList = (await Subscription.find({ subscriber: _id })).map(({ creator }) => creator)
        const videoList = await Video.find({ creator: { $in: subsList } })
            .sort({ createdAt: -1 })
            .populate('creator')
        const podcastList = await Podcast.find({ creator: { $in: subsList } })
            .sort({ createdAt: -1 })
            .populate('creator')
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

export const addSubscription = async ({ stuid }, _, _id) => {
    try {
        // Find creator
        const creatorInfo = await User.findOne({ stuid })
        if (!creatorInfo) {
            // Creator not found
            return errorMessage(4043)
        }
        if (_id?.equals(creatorInfo?._id)) {
            // Self-subscribing
            return errorMessage(4223)
        }

        // Save subscription
        const data = { creator: creatorInfo._id, subscriber: _id }
        await Subscription.findOneAndUpdate(
            { ...data },
            { $setOnInsert: data },
            { upsert: true, new: true, runValidators: true }
        )
        return {
            status: 200,
            message: 'success'
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}

export const removeSubscription = async ({ stuid }, _, _id) => {
    try {
        // Find creator
        const creatorInfo = await User.findOne({ stuid })
        if (!creatorInfo) {
            // Creator not found
            return errorMessage(4043)
        }

        // Remove subscription
        await Subscription.deleteOne({ creator: creatorInfo._id, subscriber: _id })
        return {
            status: 200,
            message: 'success'
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}
