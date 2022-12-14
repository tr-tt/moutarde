const {authMiddleware, postMiddleware} = require('../middlewares')
const controller = require('../controllers/post.controller')

module.exports = (app) =>
{
    app.get(
        '/api/post',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken
        ],
        controller.getApiPost
    )

    app.post(
        '/api/post',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken,
            postMiddleware.titleExist,
            postMiddleware.toolExist
        ],
        controller.postApiPost
    )

    app.get(
        '/api/post/:id',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken,
            postMiddleware.postIdExist
        ],
        controller.getApiPostId
    )

    app.delete(
        '/api/post/:id',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken
        ],
        controller.deleteApiPostId
    )

    app.put(
        '/api/post/:id',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken,
            postMiddleware.postIdExist,
            postMiddleware.titleExist,
            postMiddleware.toolExist
        ],
        controller.putApiPostId
    )
}