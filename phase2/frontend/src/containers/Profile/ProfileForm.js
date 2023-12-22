import React, { useEffect, useState } from 'react'

import { Form, Input, Typography, Modal as _Modal } from 'antd'

import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useGlobalContext } from '@/helpers/context'

const { Title } = Typography

const Modal = styled(_Modal)`
    .ant-modal-content {
        border-radius: 1rem !important;
        padding: 24px;
    }
`

const ProfileForm = ({ userInfo, open, onClose, fetchData }) => {
    const { connect, message } = useGlobalContext()

    const [isUploading, setIsUploading] = useState(false)
    const [initValues, setInitValues] = useState({})
    const [form] = Form.useForm()

    const handleUploadFormSubmit = async (data) => {
        try {
            setIsUploading(true)
            await connect.put(`/user`, data)
            setIsUploading(false)
            message.success('個人檔案更新成功')
            onClose()
            fetchData()
        } catch (error) {
            setIsUploading(false)
            message.error(error)
        }
    }

    useEffect(() => {
        if (userInfo) {
            setInitValues({
                name: userInfo?.name ?? '',
                selfIntro: userInfo?.selfIntro ?? ''
            })
        }
    }, [userInfo])

    useEffect(() => {
        if (open) form.resetFields()
    }, [open])

    return (
        <Modal
            centered
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            okButtonProps={{ loading: isUploading }}
        >
            <Title level={4} className="-mt-px mb-5">
                更新個人檔案
            </Title>
            <Form
                form={form}
                onFinish={handleUploadFormSubmit}
                initialValues={initValues}
                requiredMark={false}
                className="mb-1"
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item name="name" label="名稱" rules={[{ required: true, message: '請輸入您的名稱。' }]}>
                    <Input placeholder="請選用一個能代表你的身分和內容的頻道名稱。" />
                </Form.Item>

                <Form.Item name="selfIntro" label="頻道介紹">
                    <Input.TextArea placeholder="請向觀眾介紹頻道。這個說明會出現在頻道的「關於」欄位。 (選填)" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

ProfileForm.propTypes = {
    userInfo: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    fetchData: PropTypes.func
}

ProfileForm.defaultProps = {
    userInfo: {},
    tabItems: [],
    open: 'about',
    onClose: () => {},
    fetchData: () => {}
}

export default ProfileForm
