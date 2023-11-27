import React from 'react'

import { Button } from 'antd'

import Icon from '../components/Icon'
import PropTypes from 'prop-types'

import { useGlobalContext } from '@/helpers/context'

const SubscribeButton = ({ stuid, subscribed, fetchData }) => {
    const { connect } = useGlobalContext()

    const handleSubscribeClick = async () => {
        try {
            !subscribed
                ? await connect.post('/subscription', { stuid })
                : await connect.delete('/subscription', { stuid })
            fetchData()
        } catch (error) {}
    }

    return !subscribed ? (
        <Button
            type="primary"
            icon={<Icon icon="heart_plus" size={14} className="mr-0.5 scale-150" />}
            className="flex items-center"
            onClick={handleSubscribeClick}
        >
            訂閱
        </Button>
    ) : (
        <Button
            icon={<Icon icon="heart_check" size={14} className="mr-0.5 scale-150" />}
            className="flex items-center"
            onClick={handleSubscribeClick}
        >
            已訂閱
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
