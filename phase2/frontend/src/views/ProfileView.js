import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Button, Typography } from 'antd'

import VideosCard from '../containers/Profile/VideosCard'

import { useGlobalContext } from '@/helpers/context'

import ProfileCard from '@/containers/Profile/ProfileCard'

import TitledCard from '@/components/TitledCard'

const { Paragraph } = Typography

const ProfileView = () => {
    const navigate = useNavigate()
    const { connect } = useGlobalContext()
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
            {activeTab === 'videos' && <VideosCard videos={channelInfo?.videos}/>}
        </div>
    )
}

export default ProfileView
