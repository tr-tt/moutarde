const db = require('../postgres')
const httpCodes = require('../httpCodes')
const logger = require('../logger')

exports.getApiPost = (req, res) =>
{
    db.User
        .findByPk(req.user_id, {include: [db.Post]})
        .then((user) =>
        {
            if(user)
            {
                const posts = user.Posts

                posts.forEach((post) =>
                {
                    post.dataValues.UserId && delete post.dataValues.UserId
                    post.dataValues.updatedAt && delete post.dataValues.updatedAt
                })

                logger.debug(`user id ${req.user_id} has ${posts.length} posts found`, {file: 'post.controller.js', function: 'getApiPost', http: httpCodes.OK})

                return res
                    .status(httpCodes.OK)
                    .json({
                        message: posts
                    })
            }
            else
            {
                logger.warn(`user id ${req.user_id} not found`, {file: 'post.controller.js', function: 'getApiPost', http: httpCodes.NOT_FOUND})

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `Les formulaires de l'utilisateur numéro ${req.user_id} n'ont pas été trouvés.`,
                    })
            }
        })
        .catch((exception) =>
        {
            logger.error(`user id ${req.user_id} exception ${exception.message}`, {file: 'post.controller.js', function: 'getApiPost', http: httpCodes.INTERNAL_SERVER_ERROR})
    
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche des formulaires.`,
                })
        })
}

exports.postApiPost = (req, res) =>
{
    const postData = {}

    postData.UserId = req.user_id
    postData.title = req.body.title
    postData.tool = req.body.tool

    postData.image = req.files && req.files.image ? req.files.image.data : null

    db.sequelize
        .transaction((transaction) =>
        {
             return db.Post
                .create(postData,
                {
                    transaction: transaction
                })
        })
        .then((post) =>
        {
            logger.debug(`user id ${req.user_id} created a new post with title ${req.body.title}`, {file: 'post.controller.js', function: 'postApiPost', http: httpCodes.OK})

            return res
                .status(httpCodes.OK)
                .json({
                    message: `Le formulaire a été enregistré.`
                })
        })
        .catch((exception) =>
        {
            logger.error(`user id ${req.user_id} exception ${exception.message}`, {file: 'post.controller.js', function: 'postApiPost', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de l'enregistrement du formulaire.`,
                })
        })
}

exports.getApiPostId = (req, res) =>
{
    return res
        .status(httpCodes.OK)
        .json({
            message: req.post
        })
}

exports.deleteApiPostId = (req, res) =>
{
    db.sequelize
        .transaction((transaction) =>
        {
            return db.Post
                .destroy({
                    where:
                    {
                        id: req.params.id
                    }
                },
                {
                    transaction: transaction
                })
        })
        .then((count) =>
        {
            logger.debug(`post id ${req.params.id} row(s) ${count} deleted`, {file: 'post.controller.js', function: 'deleteApiPostId', http: httpCodes.OK})

            return res
                .status(httpCodes.OK)
                .json({
                    message: `Le formulaire a été supprimé.`
                })
        })
        .catch((exception) =>
        {
            logger.error(`post id ${req.params.id} exception ${exception.message}`, {file: 'post.controller.js', function: 'deleteApiPostId', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la suppression d'un formulaire.`,
                })
        })
}

exports.putApiPostId = (req, res) =>
{
    const postData = {}

    postData.title = req.body.title
    postData.tool = req.body.tool
    
    postData.image = req.files && req.files.image ? req.files.image.data : null

    db.sequelize
        .transaction((transaction) =>
        {
            return db.Post
                .update(postData,
                {
                    where:
                    {
                        id: req.params.id
                    }
                },
                {
                    transaction: transaction
                })
        })
        .then((count) =>
        {
            logger.debug(`post id ${req.params.id} title ${postData.title} row(s) ${count} updated`, {file: 'post.controller.js', function: 'putApiPostId', http: httpCodes.OK})

            return res
                    .status(httpCodes.OK)
                    .json({
                        message: `Votre formulaire a été mis à jour.`
                    })
        })
        .catch((exception) =>
        {
            logger.error(`post id ${req.params.id} title ${postData.title} exception ${exception.message}`, {file: 'post.controller.js', function: 'putApiPostId', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la mise à jour du formulaire.`,
                })
        })
}