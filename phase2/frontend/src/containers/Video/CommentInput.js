import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, ConfigProvider, Flex, Form, Input, List } from 'antd'

import Avatar from '../../components/Avatar'
import PropTypes from 'prop-types'

import { useGlobalContext } from '@/helpers/context'

const CommentInput = ({ videoId, fetchData }) => {
    const { connect, message } = useGlobalContext()

    const userInfo = useSelector((state) => state.userInfo) ?? {}

    const [showTools, setShowTools] = useState(false)
    const [isButtonLoading, setIsButtonLoading] = useState(false)
    const [form] = Form.useForm()
    const contentValue = Form.useWatch('content', form)

    const handlePostComment = async (data) => {
        try {
            setIsButtonLoading(true)
            await connect.post('/comment', { ...data, videoId })
            setIsButtonLoading(false)
            form.resetFields()
            setShowTools(false)
            message.success('已送出留言')
            fetchData()
        } catch (err) {
            message.error(err)
            setIsButtonLoading(false)
        }
    }

    return (
        <List.Item.Meta
            avatar={<Avatar simple avatar={userInfo?.avatar} />}
            className="py-1.5"
            description={
                <Form
                    form={form}
                    onFinish={handlePostComment}
                    initialValues={{ content: '' }}
                    layout="horizontal"
                    autoComplete="off"
                >
                    <ConfigProvider theme={{ token: { controlHeight: 40 } }}>
                        <Form.Item name="content" className="m-0">
                            <Input.TextArea
                                autoSize={{ minRows: 1, maxRows: 8 }}
                                placeholder="發表留言"
                                onFocus={() => setShowTools(true)}
                            />
                        </Form.Item>
                    </ConfigProvider>
                    {showTools && (
                        <Flex justify="flex-end" gap={8} className="mt-2">
                            <Button onClick={() => setShowTools(false)}>取消</Button>
                            <Button
                                htmlType="submit"
                                type="primary"
                                loading={isButtonLoading}
                                disabled={(contentValue ?? '').trim().length === 0}
                            >
                                發表
                            </Button>
                        </Flex>
                    )}
                </Form>
            }
        />
    )
}

CommentInput.propTypes = {
    videoId: PropTypes.string.isRequired,
    fetchData: PropTypes.func
}

CommentInput.defaultProps = {
    videoId: '',
    fetchData: () => {}
}

export default CommentInput
