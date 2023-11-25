import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { ConfigProvider, Layout, Menu, theme } from 'antd'

import Icon from '../components/Icon'
import UserInfoButton from './UserInfoButton'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { gray } from '@ant-design/colors'

import { ReactComponent as _LogoIcon } from '@/assets/PiTube_Red.svg'
import { ReactComponent as _LogoText } from '@/assets/PiTube_Text.svg'

const LogoIcon = styled(_LogoIcon)`
    .svg-red {
        fill: ${(p) => p.$redColor} !important;
    }
    .svg-white {
        fill: #ffffff;
    }
`

const LogoText = styled(_LogoText)`
    .svg-text {
        fill: ${(p) => p.$textColor} !important;
    }
`

const Sider = ({ isDarkMode, toggleDarkMode }) => {
    const location = useLocation()
    const { token } = theme.useToken()

    const [collapsed, setCollapsed] = useState(false)
    const [currPage, setCurrPage] = useState('')

    useEffect(() => {
        setCurrPage(location.pathname.split('/')[1] ?? '')
    }, [location.pathname])

    const menuItems = [
        { name: '', icon: 'home', text: '首頁' },
        { name: 'subscriptions', icon: 'star', text: '訂閱頻道' }
    ]

    return (
        <Layout.Sider theme="light" collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="flex h-full flex-col p-1">
                {/* Home Button */}
                <ConfigProvider theme={{ token: { controlHeight: 40, colorPrimary: gray[0] } }}>
                    <Menu
                        className="border-0"
                        selectedKeys={[]}
                        mode="inline"
                        items={[
                            {
                                icon: <LogoIcon $redColor={token.colorPrimary} className="h-3.5 w-3.5 scale-[1.75]" />,
                                label: (
                                    <Link to="./">
                                        <LogoText $textColor={token.colorText} className="h-4 translate-y-[2.75px]" />
                                    </Link>
                                ),
                                key: 'theme',
                                title: null
                            }
                        ]}
                    />
                </ConfigProvider>

                {/* Menu Items */}
                <Menu
                    className="border-0"
                    selectedKeys={[currPage]}
                    mode="inline"
                    items={menuItems.map(({ name, icon, text }) => ({
                        icon: (
                            <Icon
                                icon={icon}
                                size={14}
                                weight={currPage === name ? 'filled' : 'normal-300'}
                                className="h-3.5 -translate-y-[0.5px] scale-[1.75]"
                            />
                        ),
                        label: <Link to={`./${name}`}>{text}</Link>,
                        key: name,
                        title: null
                    }))}
                />

                <div className="flex-1" />

                <Menu
                    className="border-0"
                    selectedKeys={[]}
                    mode="inline"
                    onSelect={toggleDarkMode}
                    items={[
                        {
                            icon: (
                                <Icon
                                    icon={isDarkMode ? 'dark_mode' : 'light_mode'}
                                    size={14}
                                    className="h-3.5 scale-150"
                                />
                            ),
                            label: '切換主題',
                            key: 'theme',
                            title: null
                        }
                    ]}
                />
            </div>
        </Layout.Sider>
    )
}

Sider.propTypes = {
    // userInfo: PropTypes.object.isRequired,
    // tabItems: PropTypes.array,
    // activeTab: PropTypes.string,
    isDarkMode: PropTypes.bool,
    toggleDarkMode: PropTypes.func
}

Sider.defaultProps = {
    // tabItems: [],
    // activeTab: 'about',
    isDarkMode: false,
    toggleDarkMode: () => {}
}

export default Sider
