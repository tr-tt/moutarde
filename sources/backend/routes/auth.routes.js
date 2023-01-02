const {authMiddleware, userMiddleware} = require('../middlewares')
const controller = require('../controllers/auth.controller')

module.exports = (app) =>
{
    app.get(
        '/api/auth/signin',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken
        ],
        controller.getApiAuthSignin
    )

    app.post(
        '/api/auth/signin',
        [
            userMiddleware.emailOrUsernameExist,
            userMiddleware.emailOrUsernameExistInDB,
            userMiddleware.passwordExist
        ],
        controller.postApiAuthSignin
    )
    
    app.get(
        '/api/auth/signout',
        controller.getApiAuthSignout
    )
}