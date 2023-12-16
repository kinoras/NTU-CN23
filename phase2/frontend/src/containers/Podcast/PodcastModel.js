import React from 'react'

import { Button, Flex, Typography, Modal as _Modal } from 'antd'

import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useGlobalContext } from '@/helpers/context'

import Icon from '@/components/Icon'
import PlayerSlider from '@/components/PlayerSlider'

const Modal = styled(_Modal)`
    top: calc(100% - 30px - ${(p) => p.height}px);
    right: 0;
    .ant-modal-content {
        height: ${(p) => p.height}px;
        border-radius: 1rem;
        padding: 20px;
        overflow: hidden;
    }
`

const { Title, Text } = Typography

const PodcastModel = ({
    open,
    onClose,
    progress,
    setProgress,
    podcastInfo: { title, thumbnail, duration, creator },
    player
}) => {
    const { connect, convert } = useGlobalContext()

    const handlePlayerClick = () => {
        if (!player) return
        player?.paused ? player?.play() : player?.pause()
    }

    return (
        <Modal
            height={190}
            width={400}
            open={open}
            onCancel={onClose}
            footer={null}
            className="fixed right-6"
            styles={{ mask: { background: 'rgba(0, 0, 0, 0.25)' } }}
        >
            <Flex gap={12} align="center">
                <img className="aspect-square h-16 rounded-md" src={`${connect.base}${thumbnail}`} />
                <div className="flex-1 overflow-hidden pr-6">
                    <Title level={5} className="mb-px" ellipsis={{ rows: 1 }}>
                        {title}
                    </Title>
                    <Text type="secondary">{creator?.name}</Text>
                </div>
            </Flex>
            <PlayerSlider className="m-0 mb-0.5 mt-3" from={0} to={duration} value={progress} onChange={setProgress} />
            <Flex justify="space-between">
                <Text type="secondary" className="text-xs">
                    {convert.secToHms(progress)}
                </Text>
                <Text type="secondary" className="text-xs">
                    {convert.secToHms(duration)}
                </Text>
            </Flex>
            <Flex justify="space-around" className="mx-auto mt-0.5 max-w-[200px]">
                <Button type="text" shape="circle" onClick={() => setProgress(progress - 10)}>
                    <Icon icon="replay_10" size={14} weight="filled-300" className="mt-1 scale-[2]" secondary />
                </Button>
                <Button type="primary" shape="circle" className="scale-125" onClick={handlePlayerClick}>
                    <Icon icon={player?.paused ? 'play_arrow' : 'pause' } size={14} weight="filled" className="mt-1 scale-[1.75]" />
                </Button>
                <Button type="text" shape="circle" onClick={() => setProgress(progress + 30)}>
                    <Icon icon="forward_30" size={14} weight="filled-300" className="mt-1 scale-[2]" secondary />
                </Button>
            </Flex>
        </Modal>
    )
}

PodcastModel.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    progress: PropTypes.number,
    setProgress: PropTypes.func,
    podcastInfo: PropTypes.object,
    player: PropTypes.any
}

PodcastModel.defaultProps = {
    open: false,
    onClose: () => {},
    progress: 0,
    setProgress: () => {},
    podcastInfo: {}
}

export default PodcastModel
