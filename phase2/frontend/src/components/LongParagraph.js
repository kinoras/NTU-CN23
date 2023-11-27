import React, { useState } from 'react'

import { Typography } from 'antd'

import PropTypes from 'prop-types'

const { Link, Paragraph } = Typography

const LongParagraph = ({ children, className: _className, rows, ...otherProps }) => {
    const [isExpand, setIsExpand] = useState(false)
    return (
        <>
            <div className={`${isExpand ? 'w-full' : 'w-96'} overflow-hidden leading-8 ${_className}`} {...otherProps}>
                {isExpand ? (
                    <>
                        {children}
                        <Link onClick={() => setIsExpand(false)}>
                            顯示較少
                        </Link>
                    </>
                ) : (
                    <Paragraph
                        ellipsis={{
                            rows,
                            expandable: true,
                            onExpand: () => setIsExpand(true),
                            symbol: '顯示更多'
                        }}
                        className="m-0 leading-8"
                    >
                        {children}
                    </Paragraph>
                )}
            </div>
        </>
    )
}

LongParagraph.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    rows: PropTypes.number
}

LongParagraph.defaultProps = {
    children: '',
    className: '',
    rows: 1
}

export default LongParagraph
