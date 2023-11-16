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
                    src={avatar.small}
                    preview={{
                        toolbarRender: () => {},
                        imageRender: () => <img src={avatar.fullSize} />
                    }}
                />
            }
            {...otherProps}
        />
    )
}

Avatar.propTypes = {
    avatar: PropTypes.object,
    size: PropTypes.number
}

Avatar.defaultProps = {
    avatar: { small: '', fullSize: '' },
    size: 80
}

export default Avatar
