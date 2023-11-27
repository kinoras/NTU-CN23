import React, { createContext, useContext } from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

const GlobalContext = createContext()

const ContextProvider = ({ children }) => {
    const token = useSelector((state) => state.userToken) ?? ''

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

    return (
        <GlobalContext.Provider
            value={{
                connect: { get, post, put, delete: _delete, base },
                convert: { secToHms }
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node
}

export const useGlobalContext = () => useContext(GlobalContext)

export default ContextProvider
