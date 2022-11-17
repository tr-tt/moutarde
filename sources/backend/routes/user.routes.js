const {authJwt,checkUp} = require('../middlewares')
const controller = require('../controllers/user.controller')

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

    // api REST for POSTS

    app.get(
        '/api/posts',
        [
            authJwt.verifyToken
        ],
        controller.getApiPosts
    )

    app.get(
        '/api/posts/:id',
        [
            authJwt.verifyToken,
            checkUp.postIdExist
        ],
        controller.getApiPostId
    )



    // Availables pages

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
        controller.getBoard
    )

    app.get(
        '*',
        controller.getIndex
    )
}