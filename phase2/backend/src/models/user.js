import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserSchema = Schema(
    {
        name: { type: String, required: true },
        stuid: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String, required: true },
        selfIntro: { type: String, default: '' }
    },
    {
        collection: 'User',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

const exportSchema = mongoose.model('User', UserSchema)

export default exportSchema
