import User from './models/user'
import Podcast from './models/podcast'
import { exit, moveAudio } from './tools'
import { promises as fs } from 'fs'
import path from 'path'

export const audioImporter = async (name, mediaList) => {
    try {
        const creator = await User.findOne({ name })
        for (const media of mediaList) {
            const { title, filename, description, thumbnail } = media
            const { _id, duration } = await moveAudio(filename)
            await new Podcast({ _id, title, description, duration, creator }).save()
            await fs.copyFile(
                path.join(__dirname, `../public/queue/${thumbnail}`),
                path.join(__dirname, `../public/image/${_id}.png`)
            )
        }
        console.log('DONE')
    } catch (error) {
        exit(error)
    }
}