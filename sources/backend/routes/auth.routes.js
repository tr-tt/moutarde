const {checkUp} = require('../middlewares')
const controller = require('../controllers/auth.controller')

module.exports = (app) =>
{
    app.use((req, res, next) =>
    {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )

        next()
    })

    // api REST for USERS
    
    app.get(
        '/api/users',
        controller.getApiUsers
    )

    app.get(
        '/api/users/:id',
        [
            checkUp.userIdExist
        ],
        controller.getApiUsersId
    )

    app.post(
        '/api/users',
        [
            checkUp.usernameExist,
            checkUp.emailExist,
            checkUp.passwordExist,
            checkUp.usernameDuplicated,
            checkUp.emailDuplicated
        ],
        controller.postApiUsers
    )

    app.put(
        '/api/users/:id',
        [
            checkUp.usernameDuplicated,
            checkUp.emailDuplicated
        ],
        controller.putApiUsersId
    )

    app.delete(
        '/api/users/:id',
        controller.deleteApiUsersId
    )

    // SIGNIN

    app.post(
        '/api/auth/signin',
        [
            checkUp.usernameExist,
            checkUp.passwordExist
        ],
        controller.postApiAuthSignin
    )    
}