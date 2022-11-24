const authMiddleware = require('./auth.middleware')
const userMiddleware = require('./user.middleware')
const postMiddleware = require('./post.middleware')

module.exports =
{
    authMiddleware,
    userMiddleware,
    postMiddleware
}