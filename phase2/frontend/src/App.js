import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import { ConfigProvider, Layout, theme } from 'antd'
import locale from 'antd/locale/zh_TW'

import Sider from './containers/Sider'
import HomeView from './views/HomeView'

import { volcano as color } from '@ant-design/colors'

import GlobalProvider from '@/helpers/context'

import ErrorView from '@/views/ErrorView'
import ProfileView from '@/views/ProfileView'

const { Content } = Layout

const App = () => {
    const isDarkMode = useSelector((state) => state.isDarkMode)

    return (
        <ConfigProvider
            autoInsertSpaceInButton={false}
            locale={locale}
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: { controlHeight: 36, colorPrimary: color.primary }
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
                            <Route path="*" element={<ErrorView />} />
                        </Routes>
                    </Content>
                </Layout>
            </GlobalProvider>
        </ConfigProvider>
    )
}

export default App
