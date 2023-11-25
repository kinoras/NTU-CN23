import { decodeToken, errorMessage } from '../tools'

import { verifyUser, getUser } from './user'

const routeList = [
    { method: 'GET', path: '/api/user', handler: getUser },
    { method: 'POST', path: '/api/user/auth', handler: verifyUser }
]

const router = async ({ method, path, token, query, body }) => {
    // Find route
    const targetRoute = routeList.find((route) => {
        return route.method === method && route.path === path
    })

    // Return error if route not found
    if (!targetRoute || !targetRoute?.handler) {
        return errorMessage(4041)
    }

    // Check token
    const { valid, _id } = decodeToken(token)
    if (targetRoute?.auth && !valid) {
        return errorMessage(4011)
    }

    // Call handler for the route
    switch (method) {
        case 'GET':
            return await targetRoute.handler(query, token, _id)
        case 'POST':
            return await targetRoute.handler(body, token, _id)
    }
}

export default router
