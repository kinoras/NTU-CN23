import User from '../models/user'
import Subscription from '../models/subscription'
import { errorMessage } from '../tools'

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
            return errorMessage(4224)
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
