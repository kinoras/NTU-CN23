import React from 'react'
import { Card, Typography } from 'antd'

const { Text, Title } = Typography

const HomeView = () => {
    return (
        <div className="mx-auto my-0 max-w-5xl">
            <Card className="mb-4 h-full rounded-2xl p-2">
                <Title>HOME</Title>
                <Text>家</Text>
            </Card>
        </div>
    )
}

export default HomeView
