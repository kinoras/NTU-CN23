import React from 'react'

import { Card, Flex, Typography } from 'antd'

import dayjs from 'dayjs'
import PropTypes from 'prop-types'

import Icon from '@/components/Icon'
import LongParagraph from '@/components/LongParagraph'

const { Text, Title } = Typography

const ProfileHomeCard = ({ userInfo: user, videoCount, audioCount }) => {
    return (
        <Card className="rounded-2xl p-6" bodyStyle={{ padding: 0 }}>
            <Title level={4} className="mb-4">
                關於 {user?.name}
            </Title>
            <Flex gap={24}>
                <div className="flex-1">
                    {user?.selfIntro ? (
                        <LongParagraph rows={8}>{user?.selfIntro}</LongParagraph>
                    ) : (
                        <Text type="secondary">此頻道未填寫介紹。</Text>
                    )}
                </div>
                <ul className="m-0 w-56 p-0 pt-1">
                    <li className="mb-3 flex list-none items-center">
                        <Icon icon="video_library" weight="normal-200" className="mr-2" />
                        <Text>{videoCount > 0 ? `${videoCount} 部` : '沒有'}影片</Text>
                    </li>
                    <li className="mb-3 flex list-none items-center">
                        <Icon icon="podcasts" weight="normal-200" className="mr-2" />
                        <Text>{audioCount > 0 ? `${audioCount} 支` : '沒有'} Podcast</Text>
                    </li>
                    <li className="mb-3 flex list-none items-center">
                        <Icon icon="record_voice_over" weight="normal-200" className="mr-2" />
                        <Text>{user?.subsCount > 0 ? `${user?.subsCount} 名` : '沒有'}訂閱者</Text>
                    </li>
                    <li className="mb-3 flex list-none items-center">
                        <Icon icon="calendar_month" weight="normal-200" className="mr-2" />
                        <Text>{dayjs(user?.createdAt).format('YYYY 年 MM 月 DD 日')}加入</Text>
                    </li>
                    <li className="mb-3 flex list-none items-center">
                        <Icon icon="language" weight="normal-200" className="mr-2" />
                        <Text>台灣</Text>
                    </li>
                </ul>
            </Flex>
        </Card>
    )
}

ProfileHomeCard.propTypes = {
    userInfo: PropTypes.object.isRequired,
    videoCount: PropTypes.number,
    audioCount: PropTypes.number
}

ProfileHomeCard.defaultProps = {
    videoCount: 0,
    audioCount: 0
}

export default ProfileHomeCard
