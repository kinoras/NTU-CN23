import React from 'react'

import { Tabs as _Tabs } from 'antd'

import PropTypes from 'prop-types'
import styled from 'styled-components'

const Tabs = styled(_Tabs)`
    .ant-tabs-nav {
        margin: 0;
        &::before {
            content: unset;
        }
        .ant-tabs-tab {
            padding: 16px 12px;
            + .ant-tabs-tab {
                margin-left: 8px;
            }
        }
    }
`

const TabHeader = ({ items, activeKey, onChange }) => {
    return <Tabs items={items} activeKey={activeKey} onChange={onChange} />
}

TabHeader.propTypes = {
    items: PropTypes.array,
    activeKey: PropTypes.string,
    onChange: PropTypes.func
}

TabHeader.defaultProps = {
    items: [],
    activeKey: '',
    onChange: () => {}
}

export default TabHeader
