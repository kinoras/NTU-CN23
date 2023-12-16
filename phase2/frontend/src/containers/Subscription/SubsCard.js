import React from 'react'

import { Card, Typography, Tabs as _Tabs } from 'antd'

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

const { Title } = Typography

const SubsCard = ({ tabItems, activeTab, setActiveTab }) => {
    return (
        <Card className="mb-4 overflow-hidden rounded-2xl p-3 pb-0" bodyStyle={{ padding: 0, overflow: 'hidden' }}>
            <div className="flex h-12 w-full items-center rounded-lg">
                <Title level={3} className="m-0 px-3">
                    訂閱內容
                </Title>
            </div>
            <div className="mx-3">
                <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
            </div>
        </Card>
    )
}

SubsCard.propTypes = {
    userInfo: PropTypes.object.isRequired,
    tabItems: PropTypes.array,
    activeTab: PropTypes.string,
    setActiveTab: PropTypes.func,
    fetchData: PropTypes.func
}

SubsCard.defaultProps = {
    tabItems: [],
    activeTab: 'about',
    setActiveTab: () => {},
    fetchData: () => {}
}

export default SubsCard
