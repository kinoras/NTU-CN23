import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import { ConfigProvider, Layout, theme } from 'antd'
import locale from 'antd/locale/zh_TW'

import { volcano as color } from '@ant-design/colors'

import GlobalProvider from '@/helpers/context'

import AttributionView from '@/views/AttributionView'
import ErrorView from '@/views/ErrorView'
import HomeView from '@/views/HomeView'
import ProfileView from '@/views/ProfileView'
import VideoView from '@/views/VideoView'

import Sider from '@/containers/Sider'

const { Content } = Layout

const App = () => {
    const isDarkMode = useSelector((state) => state.isDarkMode)

    return (
        <ConfigProvider
            autoInsertSpaceInButton={false}
            locale={locale}
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: { controlHeight: 36, colorPrimary: color.primary, colorLink: color.primary }
            }}
        >
            <GlobalProvider>
                <Layout className="min-h-screen">
                    <Sider />
                    <Content className="p-4">
                        <Routes>
                            <Route path="/" element={<HomeView />} />
                            <Route path="/channel/:stuid" element={<ProfileView />} />
                            <Route path="/channel/:stuid/:tab" element={<ProfileView />} />
                            <Route path="/video/:videoId" element={<VideoView />} />
                            <Route path="/attribution" element={<AttributionView />} />
                            <Route path="*" element={<ErrorView />} />
                        </Routes>
                    </Content>
                </Layout>
            </GlobalProvider>
        </ConfigProvider>
    )
}

export default App
