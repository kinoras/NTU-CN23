import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { Card, Divider, Typography, theme } from 'antd'

import dayjs from 'dayjs'
import PropTypes from 'prop-types'

import { useGlobalContext } from '@/helpers/context'

import VideoPlayer from '@/containers/Video/VideoPlayer'

import Avatar from '@/components/Avatar'
import LongParagraph from '@/components/LongParagraph'
import SubscribeButton from '@/components/SubscribeButton'

const { Title, Text } = Typography

const VideoCard = ({ videoInfo, fetchData, ...otherProps }) => {
    const { connect, convert } = useGlobalContext()
    const { token } = theme.useToken()
    const { title, description, creator, thumbnail, playlist, createdAt } = videoInfo
    const { avatar, name, stuid, subscribed } = creator ?? {}

    const userInfo = useSelector((state) => state.userInfo) ?? {}

    return (
        <Card className="mb-4 overflow-hidden rounded-2xl p-3 pb-2" bodyStyle={{ padding: 0 }} {...otherProps}>
            <VideoPlayer id="video" playlist={`${connect.base}${playlist}`} thumbnail={`${connect.base}${thumbnail}`} />
            <div className="flex items-center gap-4 p-3">
                {/* Metadata */}
                <Typography className="flex-1">
                    <Title level={4} className="mb-1">
                        {title}
                    </Title>
                    <Text>
                        發布於 {dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')} <span> · </span>
                        {convert.timeDiff(createdAt, 'ago')}
                    </Text>
                </Typography>
                {/* Creator */}
                <div className="flex basis-72 items-center gap-3">
                    <Avatar simple avatar={avatar} />
                    <Typography className="flex-1">
                        <Link to={`/channel/@${stuid}`}>
                            <Title level={5} className="mb-0 leading-snug">
                                {name}
                            </Title>
                        </Link>
                        <Text type="secondary" className="leading-snug">
                            @{stuid}
                        </Text>
                    </Typography>
                    {stuid !== userInfo?.stuid && (
                        <SubscribeButton stuid={stuid} subscribed={subscribed} fetchData={fetchData} />
                    )}
                </div>
            </div>
            {(description ?? '').trim().length > 0 && (
                <div className="flex flex-col p-3 pt-1.5">
                    <Divider className="mb-3 mt-0" style={{ borderColor: token?.colorBorder }} />
                    <LongParagraph rows={4} className="-mb-1.5 mt-1">
                        {description ?? ''}
                    </LongParagraph>
                </div>
            )}
        </Card>
    )
}

VideoCard.propTypes = {
    videoInfo: PropTypes.object.isRequired,
    fetchData: PropTypes.func
}

VideoCard.defaultProps = {
    videoInfo: {},
    fetchData: async () => {}
}

export default VideoCard
