import React, { useState, useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ConfigProvider, Layout, Menu, theme } from 'antd'
import { orange as color } from '@ant-design/colors'
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome'
import { faComments, faMoon, faSun, faUser } from '@fortawesome/free-regular-svg-icons'
import locale from 'antd/locale/zh_TW'

import ProfileView from './views/ProfileView'
import ChatView from './views/ChatView'

const App = () => {
    const location = useLocation()
    const isDarkMode = useSelector((state) => state.isDarkMode)
    const dispatch = useDispatch()

    const [collapsed, setCollapsed] = useState(false)
    const [currPage, setCurrPage] = useState('')

    useEffect(() => {
        setCurrPage(location.pathname.split('/')[1] ?? '')
    }, [location.pathname])

    return (
        <ConfigProvider
            autoInsertSpaceInButton={false}
            locale={locale}
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: { controlHeight: 36, colorPrimary: color.primary }
            }}
        >
            <Layout className="min-h-screen">
                <Layout.Sider
                    theme="light"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <div className="demo-logo-vertical" />
                    <Menu
                        selectedKeys={[currPage]}
                        mode="inline"
                        className="p-1"
                        items={[
                            {
                                icon: <FaIcon icon={faUser} className="-ml-0.5 w-5 text-base" />,
                                label: <Link to="./profile">個人檔案</Link>,
                                key: 'profile'
                            },
                            {
                                icon: <FaIcon icon={faComments} className="-ml-0.5 w-5" />,
                                label: <Link to="./chat">聊天室</Link>,
                                key: 'chat'
                            }
                        ]}
                    />
                    <Menu
                        selectedKeys={[]}
                        mode="inline"
                        className="p-1"
                        items={[
                            {
                                icon: <FaIcon icon={!isDarkMode ? faMoon : faSun} className="-ml-0.5 w-5 text-base" />,
                                label: '切換主題',
                                key: 'theme'
                            }
                        ]}
                        onSelect={() => dispatch({ type: 'SET_THEME', value: !isDarkMode })}
                    />
                </Layout.Sider>
                <Layout.Content className="p-4">
                    <Routes>
                        <Route path="/" element={<></>} />
                        <Route path="/profile" element={<ProfileView />} />
                        <Route path="/chat" element={<ChatView />} />
                        <Route path="/chat/:id" element={<ChatView />} />
                    </Routes>
                </Layout.Content>
            </Layout>
        </ConfigProvider>
    )
}

export default App
