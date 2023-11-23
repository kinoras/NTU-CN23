const routeList = [
]

const router = async ({ method, path, token, query, body }) => {
    const targetRoute = routeList.find((route) => route.method === method && route.path === path)

    if (!targetRoute || !targetRoute.handler)
        return { status: 404, message: 'error', error: 'Resource not found.' }

    switch (method) {
        case 'GET': return await targetRoute.handler(query, token)
        case 'POST': return await targetRoute.handler(body, token)
    }
}

export default router
