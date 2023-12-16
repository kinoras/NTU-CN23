import React from 'react'

import { Card, Typography } from 'antd'

const { Paragraph, Text, Title } = Typography

const attributionList = {
    music: [
        {
            title: 'DEAF KEV - Invincible [NCS Release]',
            provider: 'NoCopyrightSounds',
            streamLink: 'http://youtu.be/J2X5mJ3HDYE',
            downloadLink: 'http://ncs.io/invincible'
        },
        {
            title: 'Different Heaven & EH!DE - My Heart [NCS Release]',
            provider: 'NoCopyrightSounds',
            streamLink: 'http://youtu.be/jK2aIUmmdP4',
            downloadLink: 'http://ncs.io/myheart'
        },
        {
            title: 'Janji - Heroes Tonight (feat. Johnning) [NCS Release]',
            provider: 'NoCopyrightSounds',
            streamLink: 'http://youtu.be/3nQNiWdeH2Q',
            downloadLink: 'http://ncs.io/ht'
        },
        {
            title: 'National Anthem & National Flag Anthem',
            provider: 'Taiwan Presidential Office',
            streamLink: 'https://english.president.gov.tw/Page/97',
            downloadLink: 'https://english.president.gov.tw/Page/97'
        }
    ]
}

const AttributionView = () => {
    return (
        <div className="mx-auto my-0 max-w-5xl">
            <Card className="mb-4 h-full rounded-2xl p-2">
                <Title level={1}>Attribution</Title>
                <Paragraph>
                    <Title level={3}>Music</Title>
                    <ul>
                        {attributionList.music.map(({ title, provider, streamLink, downloadLink }) => (
                            <li key={title} className="mb-2">
                                <Title level={5} className="mb-0">
                                    {title}
                                </Title>
                                <Text type="secondary">
                                    <span>{provider}</span>
                                    <span>・</span>
                                    <a href={streamLink}>Stream Link</a>
                                    <span>・</span>
                                    <a href={downloadLink}>Download Link</a>
                                </Text>
                            </li>
                        ))}
                    </ul>
                </Paragraph>
            </Card>
        </div>
    )
}

export default AttributionView
