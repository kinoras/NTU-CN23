import React from 'react'

import { Card, Typography } from 'antd'

import PropTypes from 'prop-types'

import TabHeader from '@/components/TabHeader'

const { Title } = Typography

const HomeCard = ({ tabItems, activeTab, setActiveTab }) => {
    return (
        <Card className="mb-4 overflow-hidden rounded-2xl p-3 pb-0" bodyStyle={{ padding: 0, overflow: 'hidden' }}>
            <div className="flex h-12 w-full items-center rounded-lg">
                <Title level={3} className="m-0 px-3">
                    主頁
                </Title>
            </div>
            <div className="mx-3">
                <TabHeader items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
            </div>
        </Card>
    )
}

HomeCard.propTypes = {
    tabItems: PropTypes.array,
    activeTab: PropTypes.string,
    setActiveTab: PropTypes.func
}

HomeCard.defaultProps = {
    tabItems: [],
    activeTab: 'about',
    setActiveTab: () => {}
}

export default HomeCard
