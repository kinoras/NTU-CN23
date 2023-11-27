import { decodeToken, errorMessage } from '../tools'

import { verifyUser, getUser } from './user'
import { addSubscription, removeSubscription } from './subscription'
import { getVideo, createVideo } from './video'

const routeList = [
    /* Users */
    { method: 'GET', path: '/api/user', handler: getUser, auth: false },
    { method: 'POST', path: '/api/user/auth', handler: verifyUser, auth: false },
    /* Subscriptions */
    { method: 'POST', path: '/api/subscription', handler: addSubscription, auth: true },
    { method: 'DELETE', path: '/api/subscription', handler: removeSubscription, auth: true },
    /* Video */
    { method: 'GET', path: '/api/video', handler: getVideo, auth: false },
    { method: 'POST', path: '/api/video', handler: createVideo, auth: true }
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
        case 'DELETE':
            return await targetRoute.handler(query, token, _id)
    }
}

export default router
