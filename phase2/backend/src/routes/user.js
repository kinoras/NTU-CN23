import Subscription from '../models/subscription'
import User from '../models/user'
import Video from '../models/video'
import { decodeToken, errorMessage } from '../tools'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import path from 'path'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client()

export const verifyUser = async ({ credential }) => {
    try {
        // Verify user token
        const userTicket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
        })
        const { name, picture: _avatar, email } = userTicket.getPayload()
        const avatar = _avatar.replace('=s96-c', '=s256-c')

        // Verify CSIE student
        // if (!email.endsWith('@csie.ntu.edu.tw')) {
        //     return errorMessage(4031)
        // }

        // Insert or get user info
        const stuid = email.split('@')[0]
        const userInfo = await User.findOneAndUpdate(
            { email },
            { $setOnInsert: { name, avatar, email, stuid } },
            { upsert: true, new: true, runValidators: true }
        )

        return {
            status: 200,
            message: 'success',
            user: {
                avatar: userInfo?.avatar,
                name: userInfo?.name,
                stuid: userInfo?.stuid,
                email: userInfo?.email,
                token: jwt.sign({ id: userInfo?._id }, process.env.JWT_SECRET, { expiresIn: '14d' })
            }
        }
    } catch (error) {
        return errorMessage(5003, error)
    }
}

export const getUser = async ({ stuid: _stuid, videos, podcasts }, token, _id) => {
    try {
        // Check params
        const { valid, _id } = decodeToken(token)
        if (!_stuid && !valid) {
            return errorMessage(4221)
        }

        // Construct return object
        const returnObject = {
            status: 200,
            messaage: 'success'
        }

        // Search target user
        const self = !_stuid
        const userInfo = self ? await User.findOne({ _id }) : await User.findOne({ stuid: _stuid })
        if (!userInfo) {
            return errorMessage(4043)
        }

        // Append user info
        const subscribed = !!(_id && (await Subscription.exists({ creator: userInfo?._id, subscriber: _id })))
        const { _id: userId, stuid, email, name, avatar } = userInfo
        returnObject.user = { stuid, email, name, avatar, subscribed }

        if (videos) {
            const videoList = await Video.find({ creator: userId })
            returnObject.videos = videoList.map(({ _id, title, description, duration, createdAt }) => ({
                _id,
                title,
                description,
                duration,
                thumbnail: path.join('/media/image', `${_id}.png`),
                createdAt
            }))
        }

        return returnObject
    } catch (error) {
        return errorMessage(5001, error)
    }
}
