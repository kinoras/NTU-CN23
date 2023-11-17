import React from 'react'

import { Typography } from 'antd'

import PropTypes from 'prop-types'

const { Text } = Typography

const Icon = ({ className, danger, icon, secondary, size, style, text, weight, ...otherProps }) => {
    const iconProps = {
        className: `material-symbols-rounded ${weight} ${className}`,
        style: { ...style, userSelect: 'none' },
        ...otherProps
    }
    if (secondary === true) iconProps.type = 'secondary'
    if (danger === true) iconProps.type = 'danger'
    if (size) iconProps.style.fontSize = size

    return (
        <>
            {secondary || danger ? <Text {...iconProps}>{icon}</Text> : <span {...iconProps}>{icon}</span>}
            {text}
        </>
    )
}

Icon.propTypes = {
    className: PropTypes.string,
    danger: PropTypes.bool,
    icon: PropTypes.string.isRequired,
    secondary: PropTypes.bool,
    size: PropTypes.number,
    style: PropTypes.object,
    text: PropTypes.string,
    weight: PropTypes.string
}

Icon.defaultProps = {
    className: '',
    danger: false,
    secondary: false,
    size: null,
    style: {},
    text: '',
    weight: ''
}

export default Icon
