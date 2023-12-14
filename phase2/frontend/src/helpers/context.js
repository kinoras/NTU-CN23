import React, { createContext, useContext } from 'react'
import { useSelector } from 'react-redux'

import { message } from 'antd'

import PropTypes from 'prop-types'

import Message from '@/components/Message'

const GlobalContext = createContext()

const ContextProvider = ({ children }) => {
    const token = useSelector((state) => state.userToken) ?? ''
    const [messageApi, contextHolder] = message.useMessage()

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }

    const base = `http://${window.location.host.replace(':3000', ':4000')}`

    const get = async (path, query) => {
        const queryString = new URLSearchParams(query).toString()
        const response = await fetch(`${base}/api${path}?${queryString}`, { method: 'GET', headers })
        const json = await response.json()
        if (!response.ok) throw json
        return json
    }

    const post = async (path, bodyObj) => {
        const body = JSON.stringify(bodyObj)
        const response = await fetch(`${base}/api${path}`, { method: 'POST', headers, body })
        const json = await response.json()
        if (!response.ok) throw json
        return json
    }

    const put = async (path, bodyObj) => {
        const body = JSON.stringify(bodyObj)
        const response = await fetch(`${base}/api${path}`, { method: 'PUT', headers, body })
        const json = await response.json()
        if (!response.ok) throw json
        return json
    }

    const _delete = async (path, query) => {
        const queryString = new URLSearchParams(query).toString()
        const response = await fetch(`${base}/api${path}?${queryString}`, { method: 'DELETE', headers })
        const json = await response.json()
        if (!response.ok) throw json
        return json
    }

    const secToHms = (sec) => {
        const h = Math.floor(sec / 3600)
        const m = Math.floor((sec % 3600) / 60)
        const s = Math.floor(sec % 60)

        const mm = String(m).padStart(2, '0')
        const ss = String(s).padStart(2, '0')

        return h === 0 ? `${m}:${ss}` : `${h}:${mm}:${ss}`
    }

    const showMessage = (type, title, details = '', errCode = '') => {
        messageApi.destroy()
        messageApi.open({
            content: <Message data={{ type, title, details, errCode }} />,
            duration: type === 'success' ? 1 : 5
        })
    }

    const success = (title, details) => showMessage('success', title, details ?? '')

    const error = (err) => {
        // prettier-ignore
        switch (err?.error) {
            // 401
            case 4011: showMessage('error', '請先登入', '此動作需要您先登入才能進行'); break
            // 403
            case 4033: showMessage('error', '無法完成動作', '此動作限該使用者本人進行'); break
            // 404
            case 4041: showMessage('error', '找不到 API', '找不到與此 URL 和 Method 對應的 API'); break
            case 4043: showMessage('error', '找不到指定的使用者', '使用者資訊可能已被更改'); break
            case 4044: showMessage('error', '找不到指定的影片', '這部影片可能已被刪除'); break
            case 4045: showMessage('error', '找不到指定的留言', '這則留言可能已被刪除'); break
            case 4049: showMessage('error', '找不到指定的檔案', '檔案可能已被刪除或路徑有誤'); break
            // 405
            case 4051: showMessage('error', '給我用 GET！', '請求媒體檔案時的方式並非 GET'); break
            // 422
            case 4221: showMessage('error', '無法完成動作', '請重新整理頁面或稍後再試', 'MISSING INPUT'); break
            case 4222: showMessage('error', '無法完成動作', '請重新整理頁面或稍後再試', 'INVALID INPUT'); break
            case 4223: showMessage('error', '無法訂閱自己', '請另開小帳以訂閱這個頻道'); break
            // 500
            case 5001: showMessage('error', '無法存取伺服器', '請聯絡管理員或稍候再試'); break
            case 5003: showMessage('error', '無法驗證使用者身份', '請聯絡管理員或稍候再試'); break
            default: showMessage('error', '無法處理請求', '出現未知/未預期的錯誤', err)
        }
    }

    return (
        <GlobalContext.Provider
            value={{
                connect: { get, post, put, delete: _delete, base },
                convert: { secToHms },
                message: { success, error }
            }}
        >
            {contextHolder}
            {children}
        </GlobalContext.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node
}

export const useGlobalContext = () => useContext(GlobalContext)

export default ContextProvider
