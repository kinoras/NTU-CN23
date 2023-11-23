import React, { createContext, useContext } from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

const GlobalContext = createContext()

const API_ROOT = `http://${window.location.host.replace(':3000', ':4000')}`

const ContextProvider = ({ children }) => {
    const { token } = useSelector((state) => state.auth) ?? ''

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }

    const get = async (path, query) => {
        try {
            const queryString = new URLSearchParams(query).toString()
            const response = await fetch(`${API_ROOT}${path}?${queryString}`, { method: 'GET', headers })
            return response.json()
        } catch (err) {
            console.log(err)
        }
    }

    const post = async (path, bodyObj) => {
        try {
            const body = JSON.stringify(bodyObj)
            const response = await fetch(`${API_ROOT}${path}`, { method: 'POST', headers, body })
            return response.json()
        } catch (err) {
            console.log(err)
        }
    }

    return <GlobalContext.Provider value={{ connect: { get, post } }}>{children}</GlobalContext.Provider>
}

ContextProvider.propTypes = {
    children: PropTypes.node
}

export const useGlobalContext = () => useContext(GlobalContext)

export default ContextProvider
