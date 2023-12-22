import React from 'react'
import { useDispatch } from 'react-redux'

import { Button, Card, ConfigProvider, Empty, Flex, List, Typography, theme } from 'antd'

import PropTypes from 'prop-types'

import { useGlobalContext } from '@/helpers/context'

import Icon from '@/components/Icon'

const { Paragraph, Text, Title } = Typography

const emptyText = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="沒有 Podcast" />

const ProfilePodcastCard = ({ podcasts: podcastList, className, ...otherProps }) => {
    const { connect, convert } = useGlobalContext()
    const { token } = theme.useToken()

    const dispatch = useDispatch()

    return (
        <Card className="rounded-2xl p-6 pb-2" bodyStyle={{ padding: 0 }}>
            <List
                locale={{ emptyText }}
                dataSource={podcastList}
                className={`-mt-4 ${className}`}
                renderItem={({ _id, title, description, createdAt, duration, thumbnail }) => (
                    <List.Item>
                        <Flex gap={16} align="flex-start" className="mb-1.5 mt-1 w-full">
                            <div className="relative mb-2">
                                <img src={`${connect.base}${thumbnail}`} className="h-28 w-28 rounded-md" />
                                <Text className="absolute bottom-1 right-1 aspect-video rounded bg-black bg-opacity-80 p-1 text-xs font-medium leading-3 text-white">
                                    {convert.secToHms(duration)}
                                </Text>
                            </div>
                            <div className="-mt-0.5 flex-1">
                                <div className="overflow-hidden">
                                    <Title level={5} ellipsis={{ rows: 2 }} className="m-0">
                                        {title}
                                    </Title>
                                    <div className="py-0.5">
                                        <Text type="secondary">{convert.timeDiff(createdAt, 'ago')}</Text>
                                    </div>
                                    <Paragraph className="mb-2" ellipsis={{ rows: 3 }}>
                                        {description}
                                    </Paragraph>
                                </div>
                                <ConfigProvider theme={{ token: { controlHeight: 32 } }}>
                                    <Button
                                        shape="round"
                                        className="flex -translate-x-[3px] items-center py-0.5 pl-2 pr-3.5"
                                        onClick={() => dispatch({ type: 'SET_AUDIO', value: _id })}
                                    >
                                        <Icon
                                            size={22}
                                            weight="filled"
                                            icon="play_arrow"
                                            className="-translate-y-[0.5px] scale-110"
                                            style={{ color: token.colorPrimary }}
                                        />
                                        <span className="-translate-y-[0.5px] pl-1">播放</span>
                                    </Button>
                                </ConfigProvider>
                            </div>
                        </Flex>
                    </List.Item>
                )}
                {...otherProps}
            />
        </Card>
    )
}

ProfilePodcastCard.propTypes = {
    podcasts: PropTypes.array.isRequired,
    className: PropTypes.string
}

ProfilePodcastCard.defaultProps = {
    className: ''
}

export default ProfilePodcastCard
