import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Card } from 'antd'

import { useGlobalContext } from '@/helpers/context'

import SubsCard from '@/containers/SubsCard'

import PodcastList from '@/components/PodcastList'
import VideoList from '@/components/VideoList'

const SubsView = () => {
    const navigate = useNavigate()
    const { connect, message } = useGlobalContext()
    const { tab } = useParams()

    const [activeTab, setActiveTab] = useState('videos')

    const [mediaList, setMediaList] = useState({ videos: [], podcasts: [] })

    const fetchData = async () => {
        try {
            const { videos, podcasts } = await connect.get('/subscription')
            setMediaList({ videos, podcasts })
        } catch (error) {
            message.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        setActiveTab(tab ?? 'videos')
    }, [tab])

    return (
        <div className="mx-auto my-0 max-w-5xl">
            <SubsCard
                tabItems={[
                    { key: 'videos', label: '影片' },
                    { key: 'podcasts', label: 'Podcasts' }
                ]}
                activeTab={activeTab}
                fetchData={fetchData}
                setActiveTab={(key) => {
                    const tabPath = key === 'videos' ? '' : `/${key}`
                    navigate(`/subscriptions${tabPath}`)
                }}
            />
            <Card className="rounded-2xl px-6 pb-2 pt-6" bodyStyle={{ padding: 0 }}>
                {activeTab === 'videos' && <VideoList videoList={mediaList.videos} />}
                {activeTab === 'podcasts' && <PodcastList podcastList={mediaList.podcasts} />}
            </Card>
        </div>
    )
}

export default SubsView
