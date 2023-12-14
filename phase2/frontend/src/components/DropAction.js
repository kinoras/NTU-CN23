import React from 'react'

import { Dropdown, Flex } from 'antd'

import PropTypes from 'prop-types'

import Icon from '@/components/Icon'

const DropAction = ({ items, ...otherProps }) => {
    return (
        <Dropdown
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
            menu={{
                items: items
                    .filter((item) => item.show !== false)
                    .map((item, index) =>
                        item?.type === 'divider'
                            ? { type: 'divider' }
                            : {
                                key: index,
                                danger: item.danger,
                                disabled: item.disabled,
                                label: (
                                    <Flex gap={6} align="center" className="-ml-[3px]">
                                        <Icon icon={item.icon} size={20} weight="normal-300" />
                                        {item.text}{' '}
                                    </Flex>
                                )
                            }
                    ),
                onClick: ({ key }) => items.filter((item) => item.show !== false)[key]?.action()
            }}
            {...otherProps}
        >
            <Icon
                icon="more_vert"
                weight="normal-300"
                style={{ cursor: 'pointer', marginTop: 6 }}
                // size={24}
                secondary
            />
        </Dropdown>
    )
}

DropAction.propTypes = {
    items: PropTypes.array.isRequired
}

export default DropAction
