import React, { createContext, useContext } from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

const GlobalContext = createContext()

const API_ROOT = `http://${window.location.host.replace(':3000', ':4000')}`

const ContextProvider = ({ children }) => {
    const token = useSelector((state) => state.userToken) ?? ''

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }

    const get = async (path, query) => {
        const queryString = new URLSearchParams(query).toString()
        const response = await fetch(`${API_ROOT}/api${path}?${queryString}`, { method: 'GET', headers })
        const json = await response.json()
        if (!response.ok) throw json
        return json
    }

    const post = async (path, bodyObj) => {
        const body = JSON.stringify(bodyObj)
        const response = await fetch(`${API_ROOT}/api${path}`, { method: 'POST', headers, body })
        const json = await response.json()
        if (!response.ok) throw json
        return json
    }

    const put = async (path, bodyObj) => {
        const body = JSON.stringify(bodyObj)
        const response = await fetch(`${API_ROOT}/api${path}`, { method: 'PUT', headers, body })
        const json = await response.json()
        if (!response.ok) throw json
        return json
    }

    const _delete = async (path, query) => {
        const queryString = new URLSearchParams(query).toString()
        const response = await fetch(`${API_ROOT}/api${path}?${queryString}`, { method: 'DELETE', headers })
        const json = await response.json()
        if (!response.ok) throw json
        return json
    }

    return (
        <GlobalContext.Provider value={{ connect: { get, post, put, delete: _delete } }}>
            {children}
        </GlobalContext.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node
}

export const useGlobalContext = () => useContext(GlobalContext)

export default ContextProvider
