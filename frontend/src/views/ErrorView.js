import React from 'react'
import { Card, Typography } from 'antd'

const { Text, Title } = Typography

const ErrorView = () => {
    return (
        <div className="mx-auto my-0 max-w-5xl">
            <Card className="mb-4 h-full rounded-2xl p-2">
                <Title>Page not found :(</Title>
                <Text>請從左邊列表選擇頁面。</Text>
                <br />
                <Text>Please choose a page from the menu on the left-hand side.</Text>
                <br />
                <br />
                <Text type="secondary">如果你覺得這個 profile 長得像 facebook，那你是對的；</Text>
                <br />
                <Text type="secondary">如果你覺得這個 profile 的 code 長得像 faceebok，我想應該是不太可能的。</Text>
            </Card>
        </div>
    )
}

export default ErrorView
