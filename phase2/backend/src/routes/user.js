import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'

import { decodeToken } from '../tools'
import User from '../models/user'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client()

export const verifyUser = async ({ credential }) => {
    try {
        // Verify user token
        const userTicket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID
        })
        const { name, picture: avatar, email } = userTicket.getPayload()

        // Verify CSIE student
        // if (!email.endsWith('@csie.ntu.edu.tw')) {
        //     return {
        //         status: 403,
        //         messaage: 'error',
        //         error: 4033
        //     }
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
        console.log(error)
        return {
            status: 500,
            messaage: 'error',
            error: 5003
        }
    }
}

export const getUser = async ({ stuid: _stuid, videos, podcasts }, token, _id) => {
    try {
        // Check params
        const { valid, _id } = decodeToken(token)
        if (!_stuid && !valid) {
            return {
                status: 422,
                message: 'error',
                error: 4221
            }
        }

        // Search target user
        const self = !_stuid
        const userInfo = self ? await User.findOne({ _id }) : await User.findOne({ stuid: _stuid })
        if (!userInfo) {
            return {
                status: 404,
                messaage: 'error',
                error: 4043
            }
        }
        const { stuid, email, name, avatar } = userInfo
        return {
            status: 200,
            messaage: 'success',
            user: { stuid, email, name, avatar }
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            messaage: 'error',
            error: 5001
        }
    }
}
