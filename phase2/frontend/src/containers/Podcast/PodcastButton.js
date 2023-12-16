import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { FloatButton } from 'antd'

import { useGlobalContext } from '@/helpers/context'

import PodcastModel from '@/containers/Podcast/PodcastModel'

import Icon from '@/components/Icon'

const PodcastButton = () => {
    const { connect, message } = useGlobalContext()
    const podcastId = useSelector((state) => state.audio)
    const audioRef = useRef(null)
    const buttonRef = useRef(null)

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [podcastInfo, setPodcastInfo] = useState({})
    const [progress, setProgress] = useState(0)

    const fetchData = async () => {
        try {
            const { podcast } = await connect.get('/podcast', { podcastId })
            setPodcastInfo(podcast)
        } catch (error) {
            message.error(error)
        }
    }

    useEffect(() => {
        if (podcastId) {
            fetchData()
        }
    }, [podcastId])

    useEffect(() => {
        if (audioRef && buttonRef && podcastId) {
            console.log(buttonRef?.current)
            buttonRef?.current?.click()
            audioRef?.current?.play()
            document.getElementById('video')?.pause()
        }
    }, [podcastInfo])

    const onProgressChange = (time) => {
        if (audioRef) {
            setProgress(time)
            audioRef.current.currentTime = time
        }
    }

    return (
        <>
            <PodcastModel
                forceRender
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                podcastInfo={podcastInfo}
                progress={progress}
                setProgress={onProgressChange}
                player={audioRef?.current}
            />
            <FloatButton
                type={!(audioRef?.current?.paused) ? 'primary' : 'default'}
                className="bottom-8"
                ref={buttonRef}
                icon={<Icon icon="podcasts" size={14} weight="filled" className="scale-[1.75]" />}
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            />
            <audio
                id="audio"
                ref={audioRef}
                src={`${connect.base}${podcastInfo?.audio}`}
                onPlay={() => document.getElementById('video')?.pause()}
                onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
            />
        </>
    )
}

export default PodcastButton
