import { useGlobalContext } from '@/helpers/context'

import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button, ConfigProvider, Divider, Menu, Typography, Modal as _Modal, theme } from 'antd'

import styled from 'styled-components'

import { gray } from '@ant-design/colors'

import Icon from '@/components/Icon'

const { Title, Text } = Typography

const Modal = styled(_Modal)`
    .ant-modal-content {
        border-radius: 1rem !important;
        padding: 16px;
    }
`

const UserInfoButton = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userToken = useSelector((state) => state.userToken) ?? ''
    const userInfo = useSelector((state) => state.userInfo) ?? ''
    const { connect } = useGlobalContext()
    const {
        token: { colorBorder }
    } = theme.useToken()

    const [isModalOpen, setIsModalOpen] = useState(false)

    /* GIS init */
    // Credit: A guide to custom Google Sign-in button [Leonardo Salles]
    // https://medium.com/@leonardosalles/e7b02c2c5e4f
    const gisObject = { click: () => initGis() }
    const initGis = () => {
        try {
            // Init GIS
            window.google.accounts.id.initialize({
                client_id: '335796492667-44oo6rbp51pjp6i9q5ui5b2ick7vstmb.apps.googleusercontent.com',
                callback: handleCredentialResponse
            })

            // Create GIS button wrapper
            const gisWrapper = document.createElement('div')
            gisWrapper.style.display = 'none'
            gisWrapper.classList.add('custom-google-button')
            document.body.appendChild(gisWrapper)

            // Render GIS button
            window.google.accounts.id.renderButton(gisWrapper, {})

            // Create click handler
            const gisWrapperButton = gisWrapper.querySelector('div[role=button]')
            gisObject.click = () => gisWrapperButton.click()
            gisWrapperButton.click()
        } catch (error) {
            console.log('[Error] UserInfoButton: ' + error)
        }
    }

    /* Sign-in handler */
    const handleCredentialResponse = async ({ credential }) => {
        try {
            const {
                user: { token, ...otherInfo }
            } = await connect.post('/user/auth', { credential })
            dispatch({ type: 'SET_TOKEN', value: token })
            dispatch({ type: 'SET_USER', value: otherInfo })
        } catch (error) {
            console.log(error)
        }
    }

    /* User info fetching */
    const fetchUserInfo = async () => {
        try {
            const { user } = await connect.get('/user')
            dispatch({ type: 'SET_USER', value: user })
            console.log(user)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (userToken) fetchUserInfo()
    }, [])

    /* button click handler */
    const handleUserAction = ({ key }) => {
        switch (key) {
            case 'user-info':
                setIsModalOpen(true)
                break
            case 'sign-in':
                gisObject.click()
                break
            case 'sign-out':
                dispatch({ type: 'SET_TOKEN', value: null })
                dispatch({ type: 'SET_USER', value: {} })
                break
        }
    }

    const menuItems = [
        {
            icon: <img className="h-3.5 w-3.5 scale-[1.75] rounded-full" src={userInfo?.avatar} />,
            label: userInfo?.name,
            key: 'user-info',
            title: null
        },
        {
            icon: <Icon icon="login" size={14} className="filled-300 h-3.5 -translate-y-[0.5px] scale-[1.75]" />,
            label: '登入 / 註冊',
            key: 'sign-in',
            title: null
        }
    ]

    const modalItems = [
        [
            {
                icon: 'person',
                iconScale: 1.75,
                label: '我的頻道主頁',
                handler: () => navigate(`/channel/@${userInfo?.stuid}`)
            },
            {
                icon: 'movie',
                iconScale: 1.55,
                label: '我的影片',
                handler: () => navigate(`/channel/@${userInfo?.stuid}/videos`)
            },
            {
                icon: 'podcasts',
                iconScale: 1.55,
                label: '我的 Podcast',
                handler: () => navigate(`/channel/@${userInfo?.stuid}/podcasts`)
            }
        ],
        [
            {
                icon: 'logout',
                iconScale: 1.75,
                label: '登出',
                handler: () => handleUserAction({ key: 'sign-out' }),
                props: { danger: true }
            }
        ]
    ]

    return (
        <>
            <ConfigProvider theme={{ token: { controlHeight: 40, colorPrimary: gray[0] } }}>
                <Menu
                    className="border-0"
                    mode="inline"
                    selectedKeys={[]}
                    onSelect={handleUserAction}
                    items={[menuItems[userToken ? 0 : 1]]}
                />
            </ConfigProvider>
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                width={280}
                centered={true}
                closeIcon={null}
                footer={null}
            >
                <div className="py-2 text-center">
                    <img
                        src={userInfo?.avatar}
                        className="mb-3 h-14 w-14 rounded-full border"
                        style={{ borderColor: colorBorder }}
                    />
                    <Title level={4} className="m-0 leading-7">
                        {userInfo?.name}
                    </Title>
                    <Text type="secondary">@{userInfo?.stuid}</Text>
                </div>
                {modalItems.map((group, index) => (
                    <Fragment key={index}>
                        <Divider className="my-2" />
                        {group.map(({ icon, iconScale, label, handler, props }) => (
                            <Button
                                key={`${icon}-${label}`}
                                className="mt-1 flex items-center px-3"
                                type="text"
                                block
                                icon={
                                    <Icon
                                        icon={icon}
                                        size={14}
                                        weight="normal-300"
                                        className="mr-1.5"
                                        style={{ transform: `scale(${iconScale})` }}
                                    />
                                }
                                onClick={() => {
                                    handler()
                                    setIsModalOpen(false)
                                }}
                                {...props}
                            >
                                {label}
                            </Button>
                        ))}
                    </Fragment>
                ))}
            </Modal>
        </>
    )
}

export default UserInfoButton
