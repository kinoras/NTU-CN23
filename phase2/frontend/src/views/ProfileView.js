import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button, Form, Input, InputNumber, Modal, Typography } from 'antd'

import { useGlobalContext } from '@/helpers/context'

import ProfileCard from '@/containers/Profile/ProfileCard'
import ProfilePodcastCard from '@/containers/Profile/ProfilePodcastCard'
import ProfileVideoCard from '@/containers/Profile/ProfileVideoCard'

import TitledCard from '@/components/TitledCard'

const { Paragraph } = Typography

const ProfileView = () => {
    const navigate = useNavigate()
    const { connect, message } = useGlobalContext()
    const { stuid: _stuid, tab } = useParams()

    const [activeTab, setActiveTab] = useState('home')
    const [channelInfo, setChannelInfo] = useState({})

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [form] = Form.useForm()

    const fetchData = async () => {
        try {
            const stuid = _stuid.replace('@', '')
            const result = await connect.get('/user', { stuid, videos: true, podcasts: true })
            setChannelInfo(result)
        } catch (error) {
            message.error(error)
        }
    }

    useEffect(() => {
        setActiveTab(tab ?? 'home')
    }, [tab])

    useEffect(() => {
        fetchData()
    }, [_stuid])

    const handleUploadFormSubmit = async ({ type, ...data }) => {
        try {
            setIsUploading(true)
            await connect.post(`/${type}`, data)
            setIsUploading(false)
            message.success('OK')
        } catch (error) {
            setIsUploading(false)
            message.error(error)
        }
    }

    return (
        <div className="mx-auto my-0 max-w-5xl">
            <ProfileCard
                userInfo={channelInfo?.user ?? {}}
                tabItems={[
                    { key: 'home', label: '首頁' },
                    { key: 'videos', label: '影片' },
                    { key: 'podcasts', label: 'Podcast' }
                ]}
                activeTab={activeTab}
                fetchData={fetchData}
                setActiveTab={(key) => {
                    const tabPath = key === 'home' ? '' : `/${key}`
                    navigate(`/channel/${_stuid}${tabPath}`)
                }}
            />
            {activeTab === 'home' && (
                <TitledCard title={`關於 ${channelInfo?.user?.name}`}>
                    <Modal
                        open={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        title="UPLOAD"
                        onOk={() => form.submit()}
                        okButtonProps={{ loading: isUploading }}
                    >
                        <Form form={form} onFinish={handleUploadFormSubmit} layout="vertical" autoComplete="off">
                            <Form.Item name="type" label="Type">
                                <Input />
                            </Form.Item>
                            <Form.Item name="title" label="Title">
                                <Input />
                            </Form.Item>
                            <Form.Item name="size" label="Quality">
                                <InputNumber />
                            </Form.Item>
                            <Form.Item name="description" label="Description">
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item name="filename" label="Filename">
                                <Input />
                            </Form.Item>
                            <Form.Item name="thumbnail" label="Thumbnail">
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Button onClick={() => setIsModalOpen(true)}>SHOW FORM</Button>
                    {(channelInfo?.description ?? []).map((parag, i) => (
                        <Paragraph className="leading-relaxed last:mb-0" key={i}>
                            {parag}
                        </Paragraph>
                    ))}
                </TitledCard>
            )}
            {activeTab === 'videos' && <ProfileVideoCard videos={channelInfo?.videos} />}
            {activeTab === 'podcasts' && <ProfilePodcastCard podcasts={channelInfo?.podcasts} />}
        </div>
    )
}

export default ProfileView
