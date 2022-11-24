const {userMiddleware} = require('../middlewares')
const controller = require('../controllers/user.controller')

module.exports = (app) =>
{
    app.get(
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

    app.post(
        '/api/users',
        [
            userMiddleware.usernameExist,
            userMiddleware.emailExist,
            userMiddleware.passwordExist,
            userMiddleware.usernameDuplicated,
            userMiddleware.emailDuplicated
        ],
        controller.postApiUsers
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
    )    
}