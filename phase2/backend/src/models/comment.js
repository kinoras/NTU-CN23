import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CommentSchema = Schema(
    {
        userId: { type: mongoose.Types.ObjectId, ref: 'User' },
        content: { type: String, default: '' }
    },
    {
        collection: 'Comment',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

const exportSchema = mongoose.model('Comment', CommentSchema)

export default exportSchema
