import React from 'react'
import { Avatar as AntdAvatar, Image } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const AvatarContainer = styled(AntdAvatar)`
    .ant-image-mask {
        background: rgba(0, 0, 0, 0.25) !important;
    }
    .ant-image-mask-info {
        display: none;
    }
`

const Avatar = ({ avatar, size, ...otherProps }) => {
    return (
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
    )
}

Avatar.propTypes = {
    avatar: PropTypes.string,
    size: PropTypes.number
}

Avatar.defaultProps = {
    avatar: '',
    size: 80
}

export default Avatar
