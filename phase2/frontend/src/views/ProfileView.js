import React, { useState } from 'react'

import { Image, Typography, theme } from 'antd'

import ProfileCard from '@/containers/ProfileCard'

import TitledCard from '@/components/TitledCard'

const { Paragraph } = Typography

const ProfileView = () => {
    const {
        token: { colorBorder }
    } = theme.useToken()

    const [activeTab, setActiveTab] = useState('about')

    const userInfo = {
        id: 'b10902099',
        username: 'kinoRAS',
        realname: '韓智杰',
        deptyear: '資工三',
        avatar: {
            fullSize: 'https://lh3.googleusercontent.com/a/AEdFTp6mJEU8vkVnVZb1dNXDBtNK8pg9RA76X67TgIqc=s512-c',
            small: 'https://lh3.googleusercontent.com/a/AEdFTp6mJEU8vkVnVZb1dNXDBtNK8pg9RA76X67TgIqc=s256-c'
        },
        banner: 'https://images.unsplash.com/photo-1576422608509-27457a713964?auto=format&fit=crop&q=80&w=1450&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description: [
            `（以下內容由 ChatGPT 生成）`,
            `你好，我是一名就讀於台灣大學資訊工程學系的大三學生。雖然我的參賽經驗有限，且成績屬於一般水平，但我一直充滿熱情並致力於學習和成長。
            在大學期間，我主要專攻資訊工程相關課程，包括程式設計、資料結構、演算法等。儘管我的成績可能不是頂尖的，但我一直在努力提高自己的學術水平，並且對這個領域充滿熱情。我相信，學習不僅僅在於分數，更在於對知識的理解和應用，以及持續進步。`,
            `儘管我缺乏參賽經驗，但我樂於嘗試新事物，並相信參加各種活動和競賽是我能夠不斷成長和學習的重要途徑。我期待著未來能參與各種項目，提高自己的技能，並與同學們共同合作，以實現共同目標。`,
            `此外，我也是一名團隊合作的熱愛者，我相信共同合作和協作是實現成功的關鍵。我樂於參與團隊項目，並貢獻自己的知識和技能，以實現共同的目標。
            我相信，即使我可能缺乏一些經驗，成績也不是最優秀的，但我是一個積極學習和不斷進步的學生，期待能在未來的學術和專業生涯中不斷取得更好的成就。`
        ],
        album: Array(16)
            .fill(null)
            .map((_, i) => `https://placekitten.com/${i}00/${i}00`)
            .slice(3, 16)
    }

    const tabItems = [
        { key: 'about', label: '關於' },
        { key: 'album', label: '相簿' },
        { key: 'sns', label: '社群' }
    ]

    return (
        <div className="mx-auto my-0 max-w-5xl">
            <ProfileCard userInfo={userInfo} tabItems={tabItems} activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'about' && (
                <TitledCard title={`關於 ${userInfo.username}`}>
                    {(userInfo?.description ?? []).map((parag, i) => (
                        <Paragraph className="leading-relaxed last:mb-0" key={i}>
                            {parag}
                        </Paragraph>
                    ))}
                </TitledCard>
            )}
            {activeTab === 'album' && (
                <TitledCard title={`${userInfo.username} 的相片`}>
                    <Image.PreviewGroup
                        preview={{
                            toolbarRender: () => {},
                            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`)
                        }}
                    >
                        {(userInfo?.album ?? []).map((image, i) => (
                            <div
                                key={i}
                                className="mb-3 mr-3 inline-flex overflow-hidden rounded-lg border border-solid"
                                style={{ borderColor: colorBorder }}
                            >
                                <Image src={image} className="aspect-square w-28" />
                            </div>
                        ))}
                    </Image.PreviewGroup>
                </TitledCard>
            )}
        </div>
    )
}

export default ProfileView
