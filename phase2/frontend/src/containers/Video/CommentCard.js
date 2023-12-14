import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { Card, List, Typography } from 'antd'

import PropTypes from 'prop-types'

import { useGlobalContext } from '@/helpers/context'

import CommentInput from '@/containers/Video/CommentInput'

import Avatar from '@/components/Avatar'
import DropAction from '@/components/DropAction'
import LongParagraph from '@/components/LongParagraph'

const { Title, Text } = Typography

const CommentCard = ({ videoId }) => {
    const { connect, convert, message } = useGlobalContext()

    const userInfo = useSelector((state) => state.userInfo) ?? {}

    const [comments, setComments] = useState([])

    const fetchData = async () => {
        try {
            const { comments } = await connect.get('/comment', { videoId })
            setComments(comments)
        } catch (error) {
            message.error(error)
        }
    }

    const handleRemoveComment = async (commentId) => {
        try {
            await connect.delete('/comment', { commentId })
            message.success('已刪除留言')
            fetchData()
        } catch (error) {
            message.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Card className="mb-4 overflow-hidden rounded-2xl p-6 pb-3" bodyStyle={{ padding: 0 }}>
            <Title level={4} className="m-0 -mt-[3px] text-lg">
                {comments.length ? `${comments.length} 則` : '沒有'}留言
            </Title>
            <List
                itemLayout="horizontal"
                dataSource={[{ type: 'input' }, ...comments]}
                renderItem={({ type, _id, user, content, createdAt }) => (
                    <List.Item
                        className="items-start"
                        actions={
                            type !== 'input' && [
                                <DropAction
                                    key={1}
                                    className="mt-1"
                                    items={[
                                        {
                                            icon: 'delete',
                                            text: '削除',
                                            action: () => handleRemoveComment(_id),
                                            show: user.stuid === userInfo.stuid,
                                            danger: true
                                        },
                                        {
                                            icon: 'flag',
                                            text: '報告',
                                            action: () => message.warning('禁止抓耙仔'),
                                            show: user.stuid !== userInfo.stuid
                                        }
                                    ]}
                                />
                            ]
                        }
                    >
                        {type === 'input' ? (
                            <CommentInput videoId={videoId} fetchData={fetchData} />
                        ) : (
                            <List.Item.Meta
                                className="pt-1"
                                avatar={<Avatar simple avatar={user?.avatar} />}
                                title={
                                    <div className="-mt-px">
                                        <Link to={`/channel/@${user?.stuid}`}>
                                            <Title level={5} className="mb-0 inline-block text-sm">
                                                {user?.name}
                                            </Title>
                                        </Link>
                                        <Text type="secondary" className="ml-2 inline-block text-[13px] font-normal">
                                            {convert.timeDiff(createdAt, 'ago')}
                                        </Text>
                                    </div>
                                }
                                description={<LongParagraph rows={4}>{content}</LongParagraph>}
                            />
                        )}
                    </List.Item>
                )}
            />
        </Card>
    )
}

CommentCard.propTypes = {
    videoId: PropTypes.string.isRequired
}

CommentCard.defaultProps = {
    videoId: ''
}

export default CommentCard
