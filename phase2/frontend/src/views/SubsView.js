import React, { useEffect, useState } from 'react'

import { Card, Tabs as _Tabs } from 'antd'

import styled from 'styled-components'

import { useGlobalContext } from '@/helpers/context'

import PodcastList from '@/components/PodcastList'
import VideoList from '@/components/VideoList'

const Tabs = styled(_Tabs)`
    .ant-tabs-nav {
        margin-bottom: 20px;
        .ant-tabs-tab {
            padding: 16px 12px;
            + .ant-tabs-tab {
                margin-left: 8px;
            }
        }
    }
`

const SubsView = () => {
    const { connect, message } = useGlobalContext()

    // const [activeTab, setActiveTab] = useState('home')
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

    return (
        <div className="mx-auto my-0 max-w-5xl">
            <Card className="rounded-2xl px-6 pb-2 pt-1" bodyStyle={{ padding: 0 }}>
                <Tabs
                    items={[
                        { key: 'videos', label: '影片', children: <VideoList videoList={mediaList.videos} /> },
                        {
                            key: 'podcasts',
                            label: 'Podcast',
                            children: <PodcastList podcastList={mediaList.podcasts} />
                        }
                    ]}
                    // activeKey={activeTab}
                    // onChange={setActiveTab}
                />
            </Card>
        </div>
    )
}

export default SubsView
