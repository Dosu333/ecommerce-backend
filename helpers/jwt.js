const { expressjwt: expressJwt } = require('express-jwt');

function authJwt() {
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL
    return expressJwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        path: [
            {
                url: /\/api\/v1\/products(.*)/,
                methods: ['GET', 'OPTIONS']
            },
            {
                url: /\/api\/v1\/category(.*)/,
                methods: ['GET', 'OPTIONS']
            },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    })
}

module.exports = authJwt