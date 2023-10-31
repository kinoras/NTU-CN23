import React, { useState, useEffect } from 'react'
import { Card, Menu } from 'antd'
import { Link, useParams } from 'react-router-dom'

const ChatView = () => {
    const { id: paramId } = useParams()

    const [activeChatBox, setActiveChatBox] = useState('')

    useEffect(() => {
        setActiveChatBox(paramId)
    }, [paramId])

    const chatRooms = [
        {
            name: '大一區',
            id: 'year-1'
        },
        {
            name: '大二區',
            id: 'year-2'
        },
        {
            name: 'ADA 定海神針',
            id: 'ada-ta'
        }
    ]

    return (
        <div className="mx-auto my-0 max-w-5xl">
            <Card className="mb-4 flex overflow-hidden rounded-2xl p-2" bodyStyle={{ padding: 0 }}>
                <Menu
                    selectedKeys={[activeChatBox]}
                    className="w-56"
                    items={chatRooms.map(({ id, name }) => ({
                        key: id,
                        label: <Link to={`/chat/${id}`}>{name}</Link>
                    }))}
                />
            </Card>
        </div>
    )
}

export default ChatView
