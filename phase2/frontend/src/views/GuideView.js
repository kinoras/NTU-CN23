import React from 'react'

import { Card, Divider, Typography, theme } from 'antd'

import Memebox from '@/components/Memebox'

const { Link, Paragraph, Text, Title } = Typography

const GuideView = () => {
    const { token } = theme.useToken()
    return (
        <div className="mx-auto my-0 max-w-5xl">
            <Card className="mb-4 overflow-hidden rounded-2xl p-3" bodyStyle={{ padding: 0, overflow: 'hidden' }}>
                <Memebox />
                <div className="mx-3">
                    <Title className="m-4 text-center" level={2}>
                        實用教戰手冊
                    </Title>
                    <Divider className="my-5" style={{ borderColor: token?.colorBorder }} />
                    <Paragraph>
                        <Title level={4}>寫在開始之前</Title>
                        <ul>
                            <li>
                                由於本站架設在宿舍房間，而宿網高速用量只有 6 GB/天，因此
                                <Text strong>建議使用台大網路/台大 VPN</Text>
                                或避免長時間觀看影片，感謝。
                            </li>
                            <li>
                                如果您有興趣，可以到
                                <Link href="https://github.com/kinoras/NTU-CN23" target="_blank">
                                    「這裡」
                                </Link>
                                查看本站原始碼 (<Text code>phase2</Text>目錄下)。
                            </li>
                            <li>
                                <Text delete>有發現藏在上面的爛梗嗎？(hover 看看⋯)</Text>
                            </li>
                        </ul>
                    </Paragraph>
                    <Paragraph>
                        <Title level={4}>註冊/登入</Title>
                        <ul>
                            <li>建議使用系上帳號 (@csie.ntu.edu.tw) 登入，這樣使用者名稱就會跟系上帳號相同。</li>
                            <li>本站留存關於您的個人資訊有：電郵地址、姓名 (可更改)、大頭貼 (與 Google 同步變動)。</li>
                        </ul>
                    </Paragraph>
                    <Paragraph>
                        <Title level={4}>個人頻道</Title>
                        <ul>
                            <li>可以像 YouTube 一樣查看/訂閱其他人的頻道。</li>
                            <li>不能訂閱自己的頻道。</li>
                            <li>暫未開放影片上傳功能，但可以變更頻道介紹欄位。</li>
                        </ul>
                    </Paragraph>
                    <Paragraph>
                        <Title level={4}>視訊串流</Title>
                        <ul>
                            <li>影片下方設有留言區，已登入使用者可以留言。</li>
                            <li>可以刪除自己過往的留言。</li>
                            <li>不能檢舉其他人的留言，即使有檢舉按鈕的存在。</li>
                        </ul>
                    </Paragraph>
                    <Paragraph>
                        <Title level={4}>音訊串流</Title>
                        <ul>
                            <li>播放器會在按下右下角 Podcast 按鈕後彈出。</li>
                            <li>按鈕為紅色代表正在播放，按鈕為白色代表暫停播放。</li>
                            <li>如果沒看到按鈕，代表你還沒開始播放任何音訊。</li>
                            <li>音訊開始播放時，同一視窗的影片會自動暫停；反之亦然。</li>
                        </ul>
                    </Paragraph>
                </div>
            </Card>
        </div>
    )
}

export default GuideView
