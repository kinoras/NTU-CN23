import React from 'react'

import { Avatar as _Avatar, Image } from 'antd'

import PropTypes from 'prop-types'
import styled from 'styled-components'

import { UserOutlined } from '@ant-design/icons'

const AvatarContainer = styled(_Avatar)`
    .ant-image-mask {
        background: rgba(0, 0, 0, 0.25) !important;
    }
    .ant-image-mask-info {
        display: none;
    }
`

const Avatar = ({ avatar, size, simple, ...otherProps }) => {
    return !simple ? (
        <AvatarContainer
            size={size}
            src={
                <Image
                    src={avatar}
                    preview={{
                        toolbarRender: () => {},
                        imageRender: () => <img src={avatar} />
                    }}
                />
            }
            {...otherProps}
        />
    ) : avatar ? (
        <img className="aspect-square rounded-full" style={{ height: size }} src={avatar} />
    ) : (
        <_Avatar size={size} icon={<UserOutlined />} />
    )
}

Avatar.propTypes = {
    avatar: PropTypes.string,
    size: PropTypes.number,
    simple: PropTypes.bool
}

Avatar.defaultProps = {
    avatar: '',
    size: 40,
    simple: false
}

export default Avatar
