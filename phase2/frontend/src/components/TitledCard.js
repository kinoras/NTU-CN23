import React from 'react'
import { Card, Typography } from 'antd'

import PropTypes from 'prop-types'

const { Title } = Typography

const TitledCard = ({ title, children, ...otherProps }) => {
    return (
        <Card className="overflow-hidden rounded-2xl" {...otherProps}>
            <Typography>
                <Title level={4} className="mb-4">
                    {title}
                </Title>
                {children}
            </Typography>
        </Card>
    )
}

TitledCard.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    children: PropTypes.node
}

TitledCard.defaultProps = {
    title: '',
    children: <></>
}

export default TitledCard
