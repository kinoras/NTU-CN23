import { verifyUser, getUser } from './user'

const routeList = [
    { method: 'GET', path: '/api/user', handler: getUser },
    { method: 'POST', path: '/api/user/auth', handler: verifyUser }
]

const router = async ({ method, path, token, query, body }) => {
    const targetRoute = routeList.find((r) => r.method === method && r.path === path)

    if (!targetRoute || !targetRoute.handler) {
        return { status: 404, message: 'error', error: 4041 }
    }

    switch (method) {
        case 'GET':
            return await targetRoute.handler(query, token)
        case 'POST':
            return await targetRoute.handler(body, token)
    }
}

export default router
