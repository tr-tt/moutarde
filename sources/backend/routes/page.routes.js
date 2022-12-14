const {authMiddleware, pageMiddleware, postMiddleware} = require('../middlewares')
const controller = require('../controllers/page.controller')

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
        '/posts/new',
        [
            authMiddleware.tokenExistVerify
        ],
        controller.getPostsNew
    )

    app.get(
        '/posts/edit/:id',
        [
            authMiddleware.tokenExistVerify,
            pageMiddleware.postIdExist
        ],
        controller.getPostsEdit
    )

    app.get(
        '/password/forgot',
        controller.getPasswordForgot
    )

    app.get(
        '/password/reset/:id/:token',
        [
            pageMiddleware.userIdExist,
            pageMiddleware.tokenExistVerify
        ],
        controller.getPasswordReset
    )

    app.get(
        '/contact',
        [
            authMiddleware.tokenExistVerify
        ],
        controller.getContact
    )

    app.get(
        '/',
        controller.getIndex
    )
}