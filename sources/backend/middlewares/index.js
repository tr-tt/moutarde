const authMiddleware = require('./auth.middleware')
const userMiddleware = require('./user.middleware')
const postMiddleware = require('./post.middleware')
const pageMiddleware = require('./page.middleware')

module.exports =
{
    authMiddleware,
    userMiddleware,
    postMiddleware,
    pageMiddleware
}