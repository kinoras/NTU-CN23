import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ConfigProvider, Menu } from 'antd'

import { gray } from '@ant-design/colors'

import { useGlobalContext } from '@/helpers/context'

import Icon from '@/components/Icon'
import UserInfoModal from './UserInfoModal'

const UserInfoButton = () => {
    const dispatch = useDispatch()
    const userToken = useSelector((state) => state.userToken) ?? ''
    const userInfo = useSelector((state) => state.userInfo) ?? ''

    const { connect, message } = useGlobalContext()

    const [isModalOpen, setIsModalOpen] = useState(false)

    /* GIS init */
    // Credit: A guide to custom Google Sign-in button [Leonardo Salles]
    // https://medium.com/@leonardosalles/e7b02c2c5e4f
    const gisObject = { click: () => initGis() }
    const initGis = () => {
        try {
            // Init GIS
            window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
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
    const handleCredentialResponse = async (data) => {
        try {
            const { credential } = data
            const {
                user: { token, ...otherInfo }
            } = await connect.post('/user/auth', { credential })
            dispatch({ type: 'SET_TOKEN', value: token })
            dispatch({ type: 'SET_USER', value: otherInfo })
        } catch (error) {
            message.error(error)
        }
    }

    /* User info fetching */
    const fetchUserInfo = async () => {
        try {
            const { user } = await connect.get('/user')
            dispatch({ type: 'SET_USER', value: user })
        } catch (error) {
            message.error(error)
        }
    }
    useEffect(() => {
        if (userToken) fetchUserInfo()
    }, [])

    /* button click handler */
    const handleUserAction = ({ key }) => {
        (key === 'sign-in')
            ? gisObject.click()
            : setIsModalOpen(true)
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
            <UserInfoModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}

export default UserInfoButton
