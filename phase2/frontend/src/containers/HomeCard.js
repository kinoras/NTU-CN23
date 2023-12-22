import React from 'react'
import { Link } from 'react-router-dom'

import { Card } from 'antd'

import PropTypes from 'prop-types'

import TabHeader from '@/components/TabHeader'

import GuideCover from '@/assets/guide/cover.jpg'

// const { Title } = Typography

const HomeCard = ({ tabItems, activeTab, setActiveTab }) => {
    return (
        <Card className="mb-4 overflow-hidden rounded-2xl p-3 pb-0" bodyStyle={{ padding: 0, overflow: 'hidden' }}>
            <div className="relative h-52">
                <Link
                    to="/guide"
                    className="flex h-52 w-full items-center rounded-lg bg-cover bg-center transition-all hover:brightness-95"
                    style={{ backgroundImage: 'url(' + GuideCover + ')' }}
                ></Link>
                <Link
                    to="https://www.freepik.com/free-vector/zoom-lines-comic-effect-background_24600905.htm"
                    target="_blank"
                    className="absolute bottom-0 right-0 z-50 px-3.5 py-3 text-xs text-black"
                >
                    Image by Freepik
                </Link>
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
