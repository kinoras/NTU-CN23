import React, { memo, useEffect, useRef } from 'react'

import Hls from 'hls.js'
import PropTypes from 'prop-types'

const VideoPlayer = ({ playlist = '', thumbnail = '', ...otherProps }) => {
    const videoRef = useRef(null)

    useEffect(() => {
        const video = videoRef.current
        if (Hls.isSupported()) {
            const hls = new Hls()
            hls.loadSource(playlist)
            hls.attachMedia(video)
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = playlist
            video.addEventListener('canplay', () => {
                video.play()
            })
        }
    })

    return (
        <video
            ref={videoRef}
            poster={thumbnail}
            controls
            autoPlay
            className="aspect-video w-full rounded-lg"
            onPlay={() => document?.getElementById('audio')?.pause()}
            {...otherProps}
        />
    )
}

VideoPlayer.propTypes = {
    playlist: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired
}

export default memo(VideoPlayer)
