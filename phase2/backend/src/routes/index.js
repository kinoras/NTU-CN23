import { verifyUser } from './user'

const routeList = [
    { method: 'POST', path: '/user/auth', handler: verifyUser }
]

const router = async ({ method, path, token, query, body }) => {
    const targetRoute = routeList.find((route) => route.method === method && route.path === path)

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
