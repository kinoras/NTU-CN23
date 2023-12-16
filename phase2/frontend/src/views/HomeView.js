import React, { useEffect, useState } from 'react'

import { Card } from 'antd'

import { useGlobalContext } from '@/helpers/context'

import HomeCard from '@/containers/HomeCard'

import PodcastList from '@/components/PodcastList'
import VideoList from '@/components/VideoList'

const HomeView = () => {
    const { connect, message } = useGlobalContext()

    const [activeTab, setActiveTab] = useState('videos')

    const [mediaList, setMediaList] = useState({ videos: [], podcasts: [] })

    const fetchData = async () => {
        try {
            const { videos, podcasts } = await connect.get('/suggest')
            setMediaList({ videos, podcasts })
        } catch (error) {
            message.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="mx-auto my-0 max-w-5xl">
            <HomeCard
                tabItems={[
                    { key: 'videos', label: '影片' },
                    { key: 'podcasts', label: 'Podcasts' }
                ]}
                activeTab={activeTab}
                fetchData={fetchData}
                setActiveTab={setActiveTab}
            />
            <Card className="rounded-2xl px-6 pb-2 pt-6" bodyStyle={{ padding: 0 }}>
                {activeTab === 'videos' && <VideoList videoList={mediaList.videos} />}
                {activeTab === 'podcasts' && <PodcastList podcastList={mediaList.podcasts} />}
            </Card>
        </div>
    )
}

export default HomeView
