import React from 'react'
import { Link } from 'react-router-dom'

import { Empty, Flex, List, Typography } from 'antd'

import dayjs from 'dayjs'
import PropTypes from 'prop-types'

import { useGlobalContext } from '@/helpers/context'

import Avatar from '@/components/Avatar'

const { Text, Title } = Typography

const emptyText = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="沒有影片" />

const VideoList = ({ videoList, ...otherProps }) => {
    const { connect, convert } = useGlobalContext()

    return (
        <List
            grid={{ gutter: [16, 8], xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
            locale={{ emptyText }}
            dataSource={videoList}
            renderItem={({ _id, title, creator: { avatar, name, stuid }, createdAt, duration, thumbnail }) => (
                <List.Item>
                    <Link to={`/video/${_id}`}>
                        {/* Thumbnail */}
                        <div className="relative mb-2">
                            <img src={`${connect.base}${thumbnail}`} className="w-full rounded-md" />
                            <Text className="absolute bottom-1 right-1 aspect-video rounded bg-black bg-opacity-80 p-1 text-xs font-medium leading-3 text-white">
                                {convert.secToHms(duration)}
                            </Text>
                        </div>
                        <Flex gap={9} align="flex-start" className="pt-0.5">
                            {/* Creator Avatar */}
                            <Link to={`/channel/@${stuid}`}>
                                <Avatar simple avatar={avatar} size={32} />
                            </Link>
                            <div className="-mt-0.5">
                                {/* Video Title */}
                                <Title
                                    level={5}
                                    ellipsis={{ rows: 2 }}
                                    className="m-0 text-[15px] font-medium leading-snug"
                                >
                                    {title}
                                </Title>
                                {/* Creator Name */}
                                <Link to={`/channel/@${stuid}`}>
                                    <Text type="secondary" className="mt-0.5 block text-[13px] font-medium">
                                        {name}
                                    </Text>
                                </Link>
                                {/* Upload Date */}
                                <Text type="secondary" className="block text-[13px] font-medium">
                                    {dayjs(createdAt).format('發布於 YYYY-MM-DD HH:mm:ss')}
                                </Text>
                            </div>
                        </Flex>
                    </Link>
                </List.Item>
            )}
            {...otherProps}
        />
    )
}

VideoList.propTypes = {
    videoList: PropTypes.array.isRequired
}

export default VideoList
