import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Flex, Input, Layout, Menu, theme } from 'antd'
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
const { Content, Sider } = Layout
// const { Title } = Typography

const ChatView = () => {
    const {
        token: { colorBgContainer }
    } = theme.useToken()

    const { id: paramId } = useParams()

    const [activeChatBox, setActiveChatBox] = useState('')

    useEffect(() => {
        setActiveChatBox(paramId)
    }, [paramId])

    const chatRooms = [
        {
            id: 'csie-b12',
            group: '分類討論區',
            name: '大一'
        },
        {
            id: 'csie-b11',
            group: '分類討論區',
            name: '大二'
        },
        {
            id: 'ta-ada',
            group: '助教時間',
            name: 'ADA 線上定海神針'
        }
    ]

    return (
        <div className="mx-auto my-0 h-full max-w-5xl">
            <Card className="mb-4 h-full rounded-2xl p-2" bodyStyle={{ padding: 0, height: '100%' }}>
                <Layout className="h-full">
                    <Sider theme="light" className="h-full">
                        <Menu
                            className="h-full pr-2 pt-1"
                            selectedKeys={[activeChatBox]}
                            items={Object.entries(
                                chatRooms.reduce((prev, curr) => {
                                    const key = curr.group
                                    if (!prev[key]) prev[key] = []
                                    prev[key].push(curr)
                                    return prev
                                }, {})
                            ).map(([label, rooms]) => ({
                                type: 'group',
                                label: (
                                    <span className="ml-1" style={{ fontSize: '0.9em' }}>
                                        {label}
                                    </span>
                                ),
                                children: rooms.map(({ id, name }) => ({
                                    key: id,
                                    label: (
                                        <Link to={`/chat/${id}`} className="-ml-3">
                                            {name}
                                        </Link>
                                    )
                                }))
                            }))}
                        />
                    </Sider>
                    <Content className="relative flex-1 p-3" style={{ background: colorBgContainer }}>
                        <Card className="absolute inset-x-3 bottom-3" bodyStyle={{ padding: 12 }}>
                            <Flex gap="small" align="flex-end">
                                <Input.TextArea autoSize={{ minRows: 1, maxRows: 5 }} bordered={false} />
                                <Button type="primary">
                                    <FaIcon icon={faPaperPlane} />
                                </Button>
                            </Flex>
                        </Card>
                    </Content>
                </Layout>
            </Card>
        </div>
    )
}

export default ChatView
