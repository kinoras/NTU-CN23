import React from 'react'

import { theme } from 'antd'

import styled from 'styled-components'

import Icon from '@/components/Icon'

import { ReactComponent as MemeI } from '@/assets/guide/meme-i.svg'
import { ReactComponent as MemeKung } from '@/assets/guide/meme-kung.svg'
import { ReactComponent as MemeP } from '@/assets/guide/meme-p.svg'
import { ReactComponent as MemeTube } from '@/assets/guide/meme-tube.svg'
import { ReactComponent as MemeTzu } from '@/assets/guide/meme-tzu.svg'

// prettier-ignore
const Box = styled.div`
    .meme-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        > *, svg { height: 130px; }
        .meme-spacer--25 { width: 0px; }
        .meme-spacer-30  { width: 3px; }
        .meme-spacer-85  { width: 8.5px; }
        .meme-tzu-container {
            position: relative;
            width: 97.17px;
            svg { position: absolute; }
            .meme-tzu { opacity: 0; }
        }
        .meme-kung-container {
            overflow: hidden;
            width: 0;
            svg { opacity: 0; }
        }
    }
    &:hover {
        > div:not(.meme-content) { opacity: 0 !important; }
        .meme-spacer--25 { width: 25px; }
        .meme-spacer-30  { width: 8px; }
        .meme-tzu-container {
            .meme-tzu { opacity: 1; transition-delay: 250ms; }
            .meme-p { transform: translateX(calc((97.17px + 25px) / 2 + 8px)) scale(0.25728); }
        }
        .meme-kung-container {
            width: 25px;
            svg { opacity: 1; transition-delay: 250ms; }
        }
    }
    * { transition: all cubic-bezier(0.4, 0, 0.2, 1) 500ms; }
`

const Memebox = () => {
    const { token } = theme.useToken()
    return (
        <Box style={{ background: token.colorPrimary }} className="relative h-32 rounded-lg">
            <div className="meme-content scale-[0.4]">
                <div className="meme-tzu-container">
                    <MemeP className="meme-p" />
                    <MemeTzu className="meme-tzu" />
                </div>
                <div className="meme-spacer-30" />
                <div className="meme-spacer--25" />
                <div className="meme-spacer-85" />
                <MemeI />
                <div className="meme-spacer-30" />
                <div className="meme-kung-container">
                    <MemeKung />
                </div>
                <div className="meme-spacer-85" />
                <MemeTube />
            </div>
            <div className="absolute bottom-3 right-3.5 opacity-50">
                <Icon icon="left_click" weight="filled-300" className="scale-150 text-white" />
            </div>
        </Box>
    )
}

export default Memebox
