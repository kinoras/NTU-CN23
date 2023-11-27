import React from 'react'
import { useSelector } from 'react-redux'

import { Button, Card, Divider, Flex, Typography, Tabs as _Tabs, theme } from 'antd'

import Avatar from '../components/Avatar'
import SubscribeButton from '../components/SubscribeButton'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const { Title, Text } = Typography

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

const ProfileCard = ({
    userInfo: { avatar, name, stuid, subscribed },
    tabItems,
    activeTab,
    setActiveTab,
    fetchData
}) => {
    const { token } = theme.useToken()
    const userInfo = useSelector((state) => state.userInfo) ?? {}

    return (
        <Card className="mb-4 overflow-hidden rounded-2xl p-3 pb-0" bodyStyle={{ padding: 0, overflow: 'hidden' }}>
            <img
                className="h-40 w-full rounded-lg object-cover"
                src="https://images.unsplash.com/photo-1576422608509-27457a713964?auto=format&fit=crop&q=80&w=1450&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <div className="mx-3">
                <Flex wrap="wrap" gap="small" align="flex-end">
                    <Card className="-mb-1 -mt-[75px] flex rounded-full border-none" bodyStyle={{ padding: 3 }}>
                        <Avatar size={144} avatar={avatar} style={{ borderColor: token?.colorBorder }} />
                    </Card>
                    <Typography className="flex-1">
                        <Title level={3} className="mb-0">
                            {name}
                        </Title>
                        <Text type="secondary" className="-ml-[1px] block">
                            @{stuid}
                        </Text>
                    </Typography>
                    <Button>編輯個人檔案</Button>
                    {stuid !== userInfo?.stuid && (
                        <SubscribeButton stuid={stuid} subscribed={subscribed} fetchData={fetchData} />
                    )}
                </Flex>
                <Divider className="mb-0 mt-5" style={{ borderColor: token?.colorBorder }} />
                <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
            </div>
        </Card>
    )
}

ProfileCard.propTypes = {
    userInfo: PropTypes.object.isRequired,
    tabItems: PropTypes.array,
    activeTab: PropTypes.string,
    setActiveTab: PropTypes.func,
    fetchData: PropTypes.func
}

ProfileCard.defaultProps = {
    tabItems: [],
    activeTab: 'about',
    setActiveTab: () => {},
    fetchData: () => {}
}

export default ProfileCard
