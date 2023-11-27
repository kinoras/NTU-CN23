import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { Card, Divider, Typography, theme } from 'antd'

import dayjs from 'dayjs'
import PropTypes from 'prop-types'

import { useGlobalContext } from '@/helpers/context'

import LongParagraph from '@/components/LongParagraph'
import SubscribeButton from '@/components/SubscribeButton'
import VideoPlayer from '@/components/VideoPlayer'

const { Title, Text, Paragraph } = Typography

const VideoCard = ({ videoInfo, fetchData }) => {
    const { connect } = useGlobalContext()
    const { token } = theme.useToken()
    const { title, description, creator, playlist, createdAt } = videoInfo
    const { avatar, name, stuid, subscribed } = creator ?? {}

    const userInfo = useSelector((state) => state.userInfo) ?? {}

    return (
        <Card className="mb-4 flex overflow-hidden rounded-2xl p-3 pb-2" bodyStyle={{ padding: 0 }}>
            <VideoPlayer playlist={`${connect.base}${playlist}`} />
            <div className="flex items-center gap-4 p-3">
                {/* Metadata */}
                <Typography className="flex-1">
                    <Title level={4} className="mb-1">
                        {title}
                    </Title>
                    <Text>發布於 {dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                </Typography>
                {/* Creator */}
                <div className="flex basis-72 items-center gap-3">
                    <img className="h-10 w-10 rounded-full" src={avatar} />
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
                    <LongParagraph rows={4} className="-mb-1.5 pt-1">
                        {(description ?? '').split('\n').map((line, index) => (
                            <Paragraph className="m-0" key={index}>
                                {line}
                            </Paragraph>
                        ))}
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
