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
        '/board',
        [
            authMiddleware.tokenExistVerify
        ],
        controller.getBoard
    )

    app.get(
        '*',
        controller.getIndex
    )
}