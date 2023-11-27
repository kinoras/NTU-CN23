import React, { useEffect, useRef, useState } from 'react'

import { Typography } from 'antd'

import PropTypes from 'prop-types'

const { Link, Paragraph } = Typography

const LongParagraph = ({ children, rows, ...otherProps }) => {
    const [isExpand, setIsExpand] = useState(false)
    const [needExpand, setNeedExpand] = useState(false)
    const paragraphRef = useRef(null)

    useEffect(() => {
        if (paragraphRef) {
            const resizeObserver = new ResizeObserver(() => {
                setNeedExpand(paragraphRef.current.scrollHeight > 16 * 1.5 * rows)
            })
            resizeObserver.observe(paragraphRef.current)
            return () => {
                resizeObserver.disconnect()
            }
        }
    }, [paragraphRef])

    return (
        <div {...otherProps}>
            <div
                ref={paragraphRef}
                className={`w-full overflow-hidden leading-6`}
                style={{
                    maxHeight: !isExpand && needExpand && `${1.5 * rows}rem`,
                    marginBottom: !needExpand && '6px'
                }}
            >
                {children.split('\n').map((line, index) => (
                    <Paragraph className="m-0 leading-6" key={index}>
                        {line}
                    </Paragraph>
                ))}
            </div>
            {needExpand && (
                <Link onClick={() => setIsExpand(!isExpand)} className="my-1 inline-block leading-6">
                    {!isExpand ? '顯示更多' : '顯示較少'}
                </Link>
            )}
        </div>
    )
}

LongParagraph.propTypes = {
    children: PropTypes.node,
    rows: PropTypes.number
}

LongParagraph.defaultProps = {
    children: '',
    rows: 1
}

export default LongParagraph
