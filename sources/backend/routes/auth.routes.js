const {userMiddleware} = require('../middlewares')
const controller = require('../controllers/auth.controller')

module.exports = (app) =>
{
    app.post(
        '/api/auth/signin',
        [
            userMiddleware.usernameExist,
            userMiddleware.passwordExist
        ],
        controller.postApiAuthSignin
    )
    
    app.get(
        '/api/auth/signout',
        controller.getApiAuthSignout
    )
}