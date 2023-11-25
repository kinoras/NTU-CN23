import mongoose from 'mongoose'

const Schema = mongoose.Schema

const SubscriptionSchema = Schema(
    {
        creator: { type: mongoose.Types.ObjectId, ref: 'User' },
        subscriber: { type: mongoose.Types.ObjectId, ref: 'User' }
    },
    {
        collection: 'Subscription',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

const exportSchema = mongoose.model('Subscription', SubscriptionSchema)

export default exportSchema
