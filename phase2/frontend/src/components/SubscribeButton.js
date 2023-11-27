import React, { useState } from 'react'

import { Button } from 'antd'

import Icon from '../components/Icon'
import PropTypes from 'prop-types'

import { useGlobalContext } from '@/helpers/context'

const SubscribeButton = ({ stuid, subscribed, fetchData }) => {
    const { connect } = useGlobalContext()

    const [isButtonLoading, setIsButtonLoading] = useState(false)

    const handleSubscribeClick = async () => {
        try {
            setIsButtonLoading(true)
            !subscribed
                ? await connect.post('/subscription', { stuid })
                : await connect.delete('/subscription', { stuid })
            await fetchData()
            setIsButtonLoading(false)
        } catch (error) {}
    }

    return (
        <Button
            loading={isButtonLoading}
            type={!subscribed ? 'primary' : 'default'}
            icon={<Icon icon={!subscribed ? 'heart_plus' : 'heart_check'} size={14} className="mr-0.5 scale-150" />}
            className="flex items-center"
            onClick={handleSubscribeClick}
        >
            {!subscribed ? '訂閱' : '已訂閱'}
        </Button>
    )
}

SubscribeButton.propTypes = {
    stuid: PropTypes.string.isRequired,
    subscribed: PropTypes.bool,
    fetchData: PropTypes.func
}

SubscribeButton.defaultProps = {
    subscribed: false,
    fetchData: () => {}
}

export default SubscribeButton
