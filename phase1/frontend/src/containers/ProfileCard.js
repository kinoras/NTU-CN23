import React from 'react'
import { Button, Card, Divider, Flex, Tabs as _Tabs, Typography, theme } from 'antd'
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Avatar from '../components/Avatar'

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

const ProfileCard = ({ userInfo, tabItems, activeTab, setActiveTab }) => {
    const {
        token: { colorBorder }
    } = theme.useToken()

    return (
        <Card className="mb-4 overflow-hidden rounded-2xl p-3 pb-0" bodyStyle={{ padding: 0, overflow: 'hidden' }}>
            <img className="h-40 w-full rounded-lg object-cover" src={userInfo?.banner} />
            <div className="mx-3">
                <Flex wrap="wrap" gap="small" align="flex-end">
                    <Card className="-mb-1 -mt-[75px] flex rounded-full border-none" bodyStyle={{ padding: 3 }}>
                        <Avatar size={144} avatar={userInfo?.avatar} style={{ borderColor: colorBorder }} />
                    </Card>
                    <Typography className="flex-1">
                        <Title level={3} className="mb-0">
                            {userInfo?.username}
                        </Title>
                        <Text type="secondary" className="-ml-[1px] block">
                            <span>@{userInfo?.id}</span>
                            <span className="mx-1">‧</span>
                            <span>{userInfo?.deptyear}</span>
                            <span className="mx-1">‧</span>
                            <span>{userInfo?.realname}</span>
                        </Text>
                    </Typography>
                    <Button>
                        <FaIcon icon={faPencil} className="mr-2" />
                        <span>編輯個人檔案</span>
                    </Button>
                </Flex>
                <Divider className="mb-0 mt-5" style={{ borderColor: colorBorder }} />
                <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
            </div>
        </Card>
    )
}

ProfileCard.propTypes = {
    userInfo: PropTypes.object.isRequired,
    tabItems: PropTypes.array,
    activeTab: PropTypes.string,
    setActiveTab: PropTypes.func
}

ProfileCard.defaultProps = {
    tabItems: [],
    activeTab: 'about',
    setActiveTab: () => {}
}

export default ProfileCard
