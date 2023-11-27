import React, { memo, useEffect, useRef } from 'react'

import Hls from 'hls.js'
import PropTypes from 'prop-types'

const VideoPlayer = ({ playlist = '' }) => {
    const videoRef = useRef(null)

    useEffect(() => {
        const video = videoRef.current
        if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(playlist)
            hls.attachMedia(video)
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                video.muted = true
            })
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = playlist
            video.addEventListener('canplay', () => {
                video.play()
            })
        }
    })

    return <video ref={videoRef} controls autoPlay className="aspect-video w-full rounded-lg" />
}

VideoPlayer.propTypes = {
    playlist: PropTypes.string.isRequired
}

export default memo(VideoPlayer)
