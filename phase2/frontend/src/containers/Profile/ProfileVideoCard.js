import React from 'react'
import { Link } from 'react-router-dom'

import { Card, Empty, List, Typography } from 'antd'

import dayjs from 'dayjs'
import PropTypes from 'prop-types'

import { useGlobalContext } from '@/helpers/context'

const { Title, Text } = Typography

const emptyText = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="沒有影片" />

const ProfileVideoCard = ({ videos: videoList }) => {
    const { connect, convert } = useGlobalContext()

    return (
        <Card className="rounded-2xl p-6 pb-2" bodyStyle={{ padding: 0 }}>
            <List
                grid={{ gutter: [16, 8], xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
                locale={{ emptyText }}
                dataSource={videoList}
                renderItem={({ _id, title, createdAt, duration, thumbnail }) => (
                    <List.Item>
                        <Link to={`/video/${_id}`}>
                            <div className="relative mb-2">
                                <img src={`${connect.base}${thumbnail}`} className="w-full rounded-md" />
                                <Text className="absolute bottom-1 right-1 aspect-video rounded bg-black bg-opacity-80 p-1 text-xs font-medium leading-3 text-white">
                                    {convert.secToHms(duration)}
                                </Text>
                            </div>
                            <Title level={5} ellipsis={{ rows: 2 }} className="m-0 text-sm font-medium leading-snug">
                                {title}
                            </Title>
                            <Text type="secondary" className="mt-1.5 block text-xs font-medium">
                                {dayjs(createdAt).format('發布於 YYYY-MM-DD HH:mm:ss')}
                            </Text>
                        </Link>
                    </List.Item>
                )}
            />
        </Card>
    )
}

ProfileVideoCard.propTypes = {
    videos: PropTypes.array
}

ProfileVideoCard.defaultProps = {
    videos: []
}

export default ProfileVideoCard
