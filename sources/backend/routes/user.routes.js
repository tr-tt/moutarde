const {authMiddleware, userMiddleware} = require('../middlewares')
const controller = require('../controllers/user.controller')

module.exports = (app) =>
{
    app.get(
        '/api/user',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken
        ],
        controller.getApiUser
    )

    app.post(
        '/api/user',
        [
            userMiddleware.jobExist,
            userMiddleware.usernameExist,
            userMiddleware.usernameDuplicated,
            userMiddleware.emailExist,
            userMiddleware.emailDuplicated,
            userMiddleware.schoolExist,
            userMiddleware.passwordExist,
            userMiddleware.confirmPasswordExist,
            userMiddleware.passwordAndConfirmPasswordIdentity          
        ],
        controller.postApiUser
    )

    app.put(
        '/api/user',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken,
            userMiddleware.jobExist,
            userMiddleware.usernameDuplicated,
            userMiddleware.emailDuplicated
        ],
        controller.putApiUser
    )

    app.delete(
        '/api/user/:id',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken
        ],
        controller.deleteApiUserId
    )

    app.post(
        '/api/user/password/forgot',
        [
            userMiddleware.emailOrUsernameExist,
            userMiddleware.emailOrUsernameExistInDB
        ],
        controller.postApiUserPasswordForgot
    )

    app.post(
        '/api/user/password/reset/:id/:token',
        [
            userMiddleware.userIdExist,
            userMiddleware.tokenExistVerify,
            userMiddleware.passwordExist,
            userMiddleware.confirmPasswordExist,
            userMiddleware.passwordAndConfirmPasswordIdentity
        ],
        controller.postApiUserPasswordReset
    )
}