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
            userMiddleware.usernameExist,
            userMiddleware.emailExist,
            userMiddleware.passwordExist,
            userMiddleware.usernameDuplicated,
            userMiddleware.emailDuplicated
        ],
        controller.postApiUser
    )

    app.put(
        '/api/user',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken,
            userMiddleware.usernameDuplicated,
            userMiddleware.emailDuplicated
        ],
        controller.putApiUser
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

    
    //===============================================//
    // REST api for USERS
    //===============================================//

    /*app.get(
        '/api/users',
        controller.getApiUsers
    )

    app.get(
        '/api/users/:id',
        [
            userMiddleware.userIdExist
        ],
        controller.getApiUsersId
    )

    

    app.put(
        '/api/users/:id',
        [
            userMiddleware.usernameDuplicated,
            userMiddleware.emailDuplicated
        ],
        controller.putApiUsersId
    )

    app.delete(
        '/api/users/:id',
        controller.deleteApiUsersId
    )*/
    
    //===============================================//
    // OTHER api for USERS
    //===============================================//

    
}