import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button, Divider, Typography, Modal as _Modal, theme } from 'antd'

import PropTypes from 'prop-types'
import styled from 'styled-components'

import Icon from '@/components/Icon'

const { Title, Text } = Typography

const Modal = styled(_Modal)`
    .ant-modal-content {
        border-radius: 1rem !important;
        padding: 16px;
    }
`

const UserInfoModal = ({ open, onClose }) => {
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const isDarkMode = useSelector((state) => state.isDarkMode)
    const userInfo = useSelector((state) => state.userInfo) ?? ''

    const {
        token: { colorBorder }
    } = theme.useToken()

    const modalItems = [
        [
            {
                icon: 'person',
                iconScale: 1.75,
                label: '我的頻道主頁',
                handler: () => {
                    navigate(`/channel/@${userInfo?.stuid}`)
                    onClose()
                }
            },
            {
                icon: 'movie',
                iconScale: 1.55,
                label: '我的影片',
                handler: () => {
                    navigate(`/channel/@${userInfo?.stuid}/videos`)
                    onClose()
                }
            },
            {
                icon: 'podcasts',
                iconScale: 1.55,
                label: '我的 Podcast',
                handler: () => {
                    navigate(`/channel/@${userInfo?.stuid}/podcasts`)
                    onClose()
                }
            }
        ],
        [
            {
                icon: 'logout',
                iconScale: 1.75,
                label: '登出',
                handler: () => {
                    dispatch({ type: 'SET_TOKEN', value: null })
                    dispatch({ type: 'SET_USER', value: {} })
                    onClose()
                },
                props: { danger: true }
            }
        ]
    ]

    return (
        <Modal open={open} onCancel={onClose} width={280} centered={true} closeIcon={null} footer={null}>
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
                            onClick={handler}
                            {...props}
                        >
                            {label}
                        </Button>
                    ))}
                </Fragment>
            ))}
        </Modal>
    )
}

UserInfoModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func
}

UserInfoModal.defaultProps = {
    open: false,
    onClose: () => {}
}

export default UserInfoModal
