import { decodeToken, errorMessage } from '../tools'
import { createComment, getComment, removeComment } from './comment'
import { createPodcast, getPodcast } from './podcast'
import { addSubscription, getSubscriptions, removeSubscription } from './subscription'
import { getSuggestions } from './suggestion'
import { getUser, verifyUser } from './user'
import { createVideo, getVideo } from './video'

const routeList = [
    /* Users */
    { method: 'GET', path: '/api/user', handler: getUser, auth: false },
    { method: 'POST', path: '/api/user/auth', handler: verifyUser, auth: false },
    /* Subscriptions */
    { method: 'GET', path: '/api/subscription', handler: getSubscriptions, auth: true },
    { method: 'POST', path: '/api/subscription', handler: addSubscription, auth: true },
    { method: 'DELETE', path: '/api/subscription', handler: removeSubscription, auth: true },
    /* Video */
    { method: 'GET', path: '/api/video', handler: getVideo, auth: false },
    { method: 'POST', path: '/api/video', handler: createVideo, auth: true },
    /* Comment */
    { method: 'GET', path: '/api/comment', handler: getComment, auth: false },
    { method: 'POST', path: '/api/comment', handler: createComment, auth: true },
    { method: 'DELETE', path: '/api/comment', handler: removeComment, auth: true },
    /* Podcast */
    { method: 'GET', path: '/api/podcast', handler: getPodcast, auth: false },
    { method: 'POST', path: '/api/podcast', handler: createPodcast, auth: true },
    /* Suggestions */
    { method: 'GET', path: '/api/suggest', handler: getSuggestions, auth: false }
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
