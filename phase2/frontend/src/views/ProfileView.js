import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button, Image, Typography, theme } from 'antd'

import { useGlobalContext } from '@/helpers/context'

import ProfileCard from '@/containers/Profile/ProfileCard'

import TitledCard from '@/components/TitledCard'

const { Paragraph } = Typography

const ProfileView = () => {
    const navigate = useNavigate()
    const { connect } = useGlobalContext()
    const { token } = theme.useToken()
    const { stuid: _stuid, tab } = useParams()

    const [activeTab, setActiveTab] = useState('home')
    const [channelInfo, setChannelInfo] = useState({})

    const fetchData = async () => {
        try {
            const stuid = _stuid.replace('@', '')
            const result = await connect.get('/user', { stuid, videos: true, podcasts: true })
            setChannelInfo(result)
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setActiveTab(tab ?? 'home')
    }, [tab])

    useEffect(() => {
        fetchData()
    }, [])

    const tabItems = [
        { key: 'home', label: '首頁' },
        { key: 'videos', label: '影片' },
        { key: 'podcasts', label: 'Podcast' }
    ]

    return (
        <div className="mx-auto my-0 max-w-5xl">
            {JSON.stringify(channelInfo?.user)}
            <ProfileCard
                userInfo={channelInfo?.user ?? {}}
                tabItems={tabItems}
                activeTab={activeTab}
                fetchData={fetchData}
                setActiveTab={(key) => {
                    const tabPath = key === 'home' ? '' : `/${key}`
                    navigate(`/channel/${_stuid}${tabPath}`)
                }}
            />
            {activeTab === 'home' && (
                <TitledCard title={`關於 ${channelInfo?.user?.name}`}>
                    <Button
                        onClick={async () => {
                            console.log(await connect.post('/video', { title: 'RickRoll', filename: 'rickroll.mp4' }))
                        }}
                    >
                        CLICK
                    </Button>
                    {(channelInfo?.description ?? []).map((parag, i) => (
                        <Paragraph className="leading-relaxed last:mb-0" key={i}>
                            {parag}
                        </Paragraph>
                    ))}
                </TitledCard>
            )}
            {activeTab === 'video' && (
                <TitledCard title={`${channelInfo.username} 的相片`}>
                    <Image.PreviewGroup
                        preview={{
                            toolbarRender: () => {},
                            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`)
                        }}
                    >
                        {(channelInfo?.album ?? []).map((image, i) => (
                            <div
                                key={i}
                                className="mb-3 mr-3 inline-flex overflow-hidden rounded-lg border border-solid"
                                style={{ borderColor: token.colorBorder }}
                            >
                                <Image src={image} className="aspect-square w-28" />
                            </div>
                        ))}
                    </Image.PreviewGroup>
                </TitledCard>
            )}
        </div>
    )
}

export default ProfileView
