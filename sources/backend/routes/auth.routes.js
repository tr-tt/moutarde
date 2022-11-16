const {verifySignUp} = require('../middlewares')
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

    app.get(
        '/signin',
        controller.signinPage
    )

    app.get(
        '/signup',
        controller.signupPage
    )

    app.post(
        '/api/auth/signup',
        [verifySignUp.checkDuplicateUsernameOrEmail],
        controller.signup
    )

    app.post(
        '/api/auth/signin',
        controller.signin
    )
}