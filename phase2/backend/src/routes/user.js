import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'

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
        if (!email.endsWith('@csie.ntu.edu.tw')) {
            return {
                status: 403,
                messaage: 'error',
                error: 4031
            }
        }

        // Insert or get user info
        const stuid = email.replace('@csie.ntu.edu.tw', '')
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
