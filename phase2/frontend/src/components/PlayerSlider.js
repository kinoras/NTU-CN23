import React from 'react'

import { ConfigProvider, Slider as _Slider, theme } from 'antd'

import PropTypes from 'prop-types'
import styled from 'styled-components'

const Slider = styled(_Slider)`
    &:hover .ant-slider-handle::after {
        box-shadow: 0 0 0 4px ${(p) => p.$mainColor} !important;
        width: 4px;
        height: 4px;
        inset-inline-start: 0;
        inset-block-start: 0;
    }
`

const PlayerSlider = ({ from, to, value, onChange, ...otherProps }) => {
    const { token } = theme.useToken()
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgElevated: token.colorPrimary
                },
                components: {
                    Slider: {
                        trackBg: token.colorPrimary,
                        trackHoverBg: token.colorPrimary,
                        handleColor: token.colorPrimary,
                        handleSize: 4,
                        handleSizeHover: 4
                    }
                }
            }}
        >
            <Slider
                min={from}
                max={to}
                value={value}
                onChange={onChange}
                $mainColor={token.colorPrimary}
                tooltip={{ formatter: null }}
                {...otherProps}
            />
        </ConfigProvider>
    )
}

PlayerSlider.propTypes = {
    from: PropTypes.number,
    to: PropTypes.number,
    value: PropTypes.number,
    onChange: PropTypes.func
}

PlayerSlider.defaultProps = {
    from: 0,
    to: 60,
    value: 0,
    onChange: () => {}
}

export default PlayerSlider
