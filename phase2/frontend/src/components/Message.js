import React from 'react'

import { Flex, Typography, theme } from 'antd'

import PropTypes from 'prop-types'

import Icon from '@/components/Icon'

const { useToken } = theme
const { Title, Text } = Typography

const Message = ({ data: { type, title, details, errCode } }) => {
    const { token } = useToken()

    const icon = { error: 'cancel', warning: 'error', success: 'check_circle' }
    const color = { error: token.colorError, warning: token.colorWarning, success: token.colorSuccess }

    return (
        ['error', 'warning', 'success'].includes(type) && (
            <Flex justify="flex-start" align="flex-start" gap={8} className="mr-[3px] text-left -translate-y-px">
                <div className="flex h-5 w-5 items-center justify-center">
                    <Icon weight="filled-500" size={20} icon={icon[type]} style={{ color: color[type] }} />
                </div>
                <div>
                    <Title level={5} className={`m-0 text-sm ${details === '' ? 'font-medium' : 'font-semibold'}`}>
                        {title}
                    </Title>
                    <Text className="block">{details}</Text>
                    <Text type="secondary" className="-mb-0.5 block text-xs italic leading-5">
                        {errCode}
                    </Text>
                </div>
            </Flex>
        )
    )
}

Message.propTypes = {
    data: PropTypes.object
}

Message.defaultProps = {
    data: {
        type: 'success',
        title: 'Untitiled Message.',
        details: '',
        errCode: ''
    }
}

export default Message
