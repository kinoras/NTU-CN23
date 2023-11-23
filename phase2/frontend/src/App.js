import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import { ConfigProvider, Layout, theme } from 'antd'
import locale from 'antd/locale/zh_TW'

import Sider from './containers/Sider'

import { volcano as color } from '@ant-design/colors'

import ChatView from '@/views/ChatView'
import ErrorView from '@/views/ErrorView'
import ProfileView from '@/views/ProfileView'
import GlobalProvider from '@/helpers/context'

const { Content } = Layout

const App = () => {
    const isDarkMode = useSelector((state) => state.isDarkMode)
    const dispatch = useDispatch()

    const toggleDarkMode = () => {
        dispatch({ type: 'SET_THEME', value: !isDarkMode })
    }

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
                    <Sider isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                    <Content className="p-4">
                        <Routes>
                            <Route path="/" element={<ProfileView />} />
                            <Route path="/home" element={<ProfileView />} />
                            <Route path="/subscription" element={<ChatView />} />
                            <Route path="/subscription/:id" element={<ChatView />} />
                            <Route path="*" element={<ErrorView />} />
                        </Routes>
                    </Content>
                </Layout>
            </GlobalProvider>
        </ConfigProvider>
    )
}

export default App
