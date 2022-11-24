const {authMiddleware, postMiddleware} = require('../middlewares')
const controller = require('../controllers/post.controller')

module.exports = (app) =>
{
    app.get(
        '/api/posts',
        controller.getApiPosts
    )

    app.get(
        '/api/posts/:id',
        [
            postMiddleware.postIdExist
        ],
        controller.getApiPostsId
    )

    app.post(
        '/api/posts',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken,
            postMiddleware.textExist
        ],
        controller.postApiPosts
    )

    app.put(
        '/api/posts/:id',
        controller.putApiPostsId
    )

    app.delete(
        '/api/posts/:id',
        controller.deleteApiPostsId
    )
}