import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'

import { ConfigProvider, Layout, Menu } from 'antd'

import Icon from '../components/Icon'

import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome'

import { ReactComponent as LogoIcon } from '@/assets/PiTube_Red.svg'
import { ReactComponent as LogoText } from '@/assets/PiTube_Text.svg'

const Sider = ({ isDarkMode, toggleDarkMode }) => {
    const location = useLocation()

    const [collapsed, setCollapsed] = useState(false)
    const [currPage, setCurrPage] = useState('')

    useEffect(() => {
        setCurrPage(location.pathname.split('/')[1] ?? '')
    }, [location.pathname])

    const menuItems = [
        { name: 'home', icon: 'home', text: '首頁' },
        { name: 'subscription', icon: 'star', text: '訂閱頻道' }
    ]

    return (
        <Layout.Sider theme="light" collapsible collapsed={collapsed} onCollapse={setCollapsed} className="p-1">
            {/* Home Button */}
            <ConfigProvider
                theme={{
                    token: { controlHeight: 40 }
                }}
            >
                <Menu
                    className="border-0"
                    selectedKeys={[]}
                    mode="inline"
                    items={[
                        {
                            icon: <LogoIcon className="h-3.5 w-3.5 scale-[2]" />,
                            label: (
                                <Link to="./">
                                    <LogoText className="h-4 translate-x-[3.5px] translate-y-[2.75px]" />
                                </Link>
                            ),
                            key: 'theme'
                        }
                    ]}
                />
            </ConfigProvider>
            {/* Menu Items */}
            <Menu
                selectedKeys={[currPage]}
                mode="inline"
                items={menuItems.map(({ name, icon, text }) => ({
                    icon: (
                        <Icon
                            icon={icon}
                            size={14}
                            weight={currPage === name && 'filled'}
                            className="h-3.5 -translate-y-[1px] scale-150"
                        />
                    ),
                    label: <Link to={`./${name}`}>{text}</Link>,
                    key: name
                }))}
            />
            <Menu
                selectedKeys={[]}
                mode="inline"
                className="p-1"
                items={[
                    {
                        icon: <FaIcon icon={!isDarkMode ? faMoon : faSun} className="text-base" />,
                        label: '切換主題',
                        key: 'theme'
                    }
                ]}
                onSelect={toggleDarkMode}
            />
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
