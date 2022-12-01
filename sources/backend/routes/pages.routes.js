const {authMiddleware} = require('../middlewares')
const controller = require('../controllers/pages.controller')

module.exports = (app) =>
{
    app.get(
        '/signin',
        controller.getSignin
    )

    app.get(
        '/signup',
        controller.getSignup
    )

    app.get(
        '/users/edit',
        [
            authMiddleware.tokenExistVerify
        ],
        controller.getUsersEdit
    )

    app.get(
        '/posts',
        [
            authMiddleware.tokenExistVerify
        ],
        controller.getPosts
    )

    app.get(
        '/password/forgot',
        controller.getPasswordForgot
    )

    app.get(
        '/password/reset/:id/:token',
        controller.getPasswordReset
    )
/*
    app.get(
        '/posts/new',
        [
            authMiddleware.tokenExistVerify
        ],
        controller.getPostsNew
    )

    app.get(
        '/posts/edit',
        [
            authMiddleware.tokenExistVerify
        ],
        controller.getPostsEdit
    )
*/
    app.get(
        '/',
        controller.getIndex
    )
}