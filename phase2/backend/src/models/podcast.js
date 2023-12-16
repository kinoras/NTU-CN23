import mongoose from 'mongoose'

const Schema = mongoose.Schema

const PodcastSchema = Schema(
    {
        title: { type: String, required: true },
        duration: { type: Number, default: 0 },
        creator: { type: mongoose.Types.ObjectId, ref: 'User' }
    },
    {
        collection: 'Podcast',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

const exportSchema = mongoose.model('Podcast', PodcastSchema)

export default exportSchema
