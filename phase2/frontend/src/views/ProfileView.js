import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useGlobalContext } from '@/helpers/context'

import ProfileCard from '@/containers/Profile/ProfileCard'
import ProfileHomeCard from '@/containers/Profile/ProfileHomeCard'
import ProfilePodcastCard from '@/containers/Profile/ProfilePodcastCard'
import ProfileVideoCard from '@/containers/Profile/ProfileVideoCard'

const ProfileView = () => {
    const navigate = useNavigate()
    const { connect, message } = useGlobalContext()
    const { stuid: _stuid, tab } = useParams()

    const [activeTab, setActiveTab] = useState('home')
    const [channelInfo, setChannelInfo] = useState({})

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
                <ProfileHomeCard
                    userInfo={channelInfo?.user}
                    videoCount={channelInfo?.videos?.length}
                    audioCount={channelInfo?.podcasts?.length}
                />
            )}
            {activeTab === 'videos' && <ProfileVideoCard videos={channelInfo?.videos} />}
            {activeTab === 'podcasts' && <ProfilePodcastCard podcasts={channelInfo?.podcasts} />}
        </div>
    )
}

export default ProfileView
