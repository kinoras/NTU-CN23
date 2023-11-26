import mongoose from 'mongoose'

const Schema = mongoose.Schema

const VideoSchema = Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        creator: { type: mongoose.Types.ObjectId, ref: 'User' },
        comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }]
    },
    {
        collection: 'Video',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

const exportSchema = mongoose.model('Video', VideoSchema)

export default exportSchema
