import Comment from '../models/comment'
import Video from '../models/video'
import { errorMessage } from '../tools'
import mongoose from 'mongoose'

export const getComment = async ({ videoId: vid }, _, userId) => {
    try {
        // Check params
        if (!vid) {
            return errorMessage(4221)
        }

        // Video ObjectId
        const videoId = new mongoose.Types.ObjectId(vid)

        // Reject if video not found
        if (!(await Video.exists({ _id: videoId }))) {
            return errorMessage(4044)
        }

        // Save the comment
        const comments = await Comment.find({ videoId }).sort({ createdAt: -1 }).populate('userId')
        return {
            status: 200,
            message: 'success',
            comments: comments.map(({ _id, userId: { stuid, email, name, avatar }, content, createdAt }) => ({
                _id,
                user: { stuid, email, name, avatar },
                content,
                createdAt
            }))
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}

export const createComment = async ({ videoId: vid, content }, _, userId) => {
    try {
        // Check params
        if (!vid || !content) {
            return errorMessage(4221)
        }
        
        // Video ObjectId
        const videoId = new mongoose.Types.ObjectId(vid)

        // Reject if video not found
        if (!await Video.exists({ _id: videoId })) {
            return errorMessage(4044)
        }

        // Reject if content is empty
        if (!content.trim().length) {
            return errorMessage(4222)
        }

        // Save the comment
        await new Comment({ userId, videoId, content }).save()
        return {
            status: 200,
            message: 'success'
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}

export const removeComment = async ({ commentId: _id }, _, userId) => {
    try {
        // Find comment
        const creatorInfo = await Comment.findOne({ _id })

        // Reject if comment not found
        if (!creatorInfo) {
            return errorMessage(4045)
        }

        // Reject if comment is by other users
        if (!creatorInfo.userId.equals(userId)) {
            return errorMessage(4033)
        }

        // Remove subscription
        await Comment.deleteOne({ _id, userId })
        return {
            status: 200,
            message: 'success'
        }
    } catch (error) {
        return errorMessage(5001, error)
    }
}
