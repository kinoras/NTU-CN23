import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Card } from 'antd'

import { useGlobalContext } from '@/helpers/context'

import VideoCard from '@/containers/Video/VideoCard'

const VideoView = () => {
    const { connect } = useGlobalContext()
    const { videoId } = useParams()

    const [videoInfo, setVideoInfo] = useState({})

    const fetchData = async () => {
        try {
            const { video } = await connect.get('/video', { videoId, comments: true })
            setVideoInfo(video)
        } catch (error) {
            setVideoInfo({})
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [videoId])

    return (
        videoInfo?.playlist &&
        true && (
            <div className="mx-auto my-0 max-w-5xl">
                <VideoCard videoInfo={videoInfo} fetchData={fetchData} />
                <Card></Card>
            </div>
        )
    )
}

export default VideoView
