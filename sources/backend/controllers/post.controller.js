const httpCodes = require('../httpCodes')
const logger = require('../logger')
const PostTable = require('../tables/post.table')
const ImageTable = require('../tables/image.table')
const UserTable = require('../tables/user.table')
const db = require('../postgres')

exports.getApiPost = (req, res) =>
{
    PostTable
        .findAllByUserId(req.user_id)
        .then((posts) =>
        {
            logger.debug(`user id ${req.user_id} has ${posts.length} posts found`, {file: 'post.controller.js', function: 'getApiPost', http: httpCodes.OK})

            return res
                .status(httpCodes.OK)
                .json({
                    message: posts
                })
        })
        .catch((exception) =>
        {
            logger.error(`Error when retrieving user id ${req.user_id}'s posts exception ${exception.message}`, {file: 'post.controller.js', function: 'getApiPost', http: httpCodes.INTERNAL_SERVER_ERROR})
    
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche des pages du carnet.`,
                })
        })
}

exports.postApiPost = async (req, res) =>
{
    const postData = {}
    const image0Data = {}
    const image1Data = {}

    postData.situation = req.body.situation
    postData.tool = req.body.tool || ''
    postData.when = req.body.when || null
    postData.feeling = req.body.feeling || ''
    postData.description = req.body.description || ''
    postData.ressource = req.body.ressource || ''
    postData.difficulty = req.body.difficulty || ''
    postData.trick = req.body.trick || ''
    postData.improvement = req.body.improvement || ''
    postData.more = req.body.more || ''
    const image0 = req.files && req.files.image0 ? req.files.image0 : null
    const image1 = req.files && req.files.image1 ? req.files.image1 : null

    if(image0)
    {
        image0Data.name = image0.name
        image0Data.type = image0.mimetype
        image0Data.blob = image0.data
    }
    image0Data.number = 0

    if(image1)
    {
        image1Data.name = image1.name
        image1Data.type = image1.mimetype
        image1Data.blob = image1.data
    }
    image1Data.number = 1

    const user = await UserTable.findById(req.user_id)

    if(user)
    {
        const transactionInstance = await db.sequelize.transaction()

        try
        {
            const post = await PostTable.createWithTransaction(postData, transactionInstance)

            await user.addPost(post, {transaction: transactionInstance})

            const image0 = await ImageTable.createWithTransaction(image0Data, transactionInstance)

            await post.addImage(image0, {transaction: transactionInstance})

            const image1 = await ImageTable.createWithTransaction(image1Data, transactionInstance)

            await post.addImage(image1, {transaction: transactionInstance})

            await transactionInstance.commit()

            logger.debug(`user id ${req.user_id} new post ${post.Id} created`, {file: 'post.controller.js', function: 'postApiPost', http: httpCodes.OK})

            return res
                .status(httpCodes.OK)
                .json({
                    message: `La nouvelle page de carnet a été enregistrée.`
                })
        }
        catch(exception)
        {
            await transactionInstance.rollback()

            logger.error(`Error when saving new post user id ${req.user_id} exception ${exception.message}`, {file: 'post.controller.js', function: 'postApiPost', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de l'enregistrement de la nouvelle page de carnet.`,
                })
        }
    }
    else
    {
        logger.error(`Error when saving finding user by id ${req.user_id} exception ${exception.message}`, {file: 'post.controller.js', function: 'postApiPost', http: httpCodes.INTERNAL_SERVER_ERROR})
    
        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `Une erreur est survenue lors de la recherche d'un utilisateur.`,
            })
    }
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
    PostTable
        .delete(req.params.id)
        .then((count) =>
        {
            logger.debug(`post id ${req.params.id} row(s) ${count} deleted`, {file: 'post.controller.js', function: 'deleteApiPostId', http: httpCodes.OK})

            return res
                .status(httpCodes.OK)
                .json({
                    message: `La page du carnet a été supprimée.`
                })
        })
        .catch((exception) =>
        {
            logger.error(`Error when deleting post id ${req.params.id} exception ${exception.message}`, {file: 'post.controller.js', function: 'deleteApiPostId', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la suppression d'une page de carnet.`,
                })
        })
}

exports.putApiPostId = async (req, res) =>
{
    const postData = {}
    const image0Data = {}
    const image1Data = {}

    postData.situation = req.body.situation
    postData.tool = req.body.tool || ''
    postData.when = req.body.when || null
    postData.feeling = req.body.feeling || ''
    postData.description = req.body.description || ''
    postData.ressource = req.body.ressource || ''
    postData.difficulty = req.body.difficulty || ''
    postData.trick = req.body.trick || ''
    postData.improvement = req.body.improvement || ''
    postData.more = req.body.more || ''
    const image0 = req.files && req.files.image0 ? req.files.image0 : null
    const image1 = req.files && req.files.image1 ? req.files.image1 : null

    if(image0)
    {
        image0Data.name = image0.name
        image0Data.type = image0.mimetype
        image0Data.blob = image0.data
    }
    else
    {
        image0Data.name = ''
        image0Data.type = ''
        image0Data.blob = null
    }
    image0Data.number = 0

    if(image1)
    {
        image1Data.name = image1.name
        image1Data.type = image1.mimetype
        image1Data.blob = image1.data
    }
    else
    {
        image1Data.name = ''
        image1Data.type = ''
        image1Data.blob = null
    }
    image1Data.number = 1

    const transactionInstance = await db.sequelize.transaction()

    try
    {
        const count = await PostTable.updateWithTransaction(postData, req.post.id, transactionInstance)

        await ImageTable.updateWithTransaction(image0Data, req.post.id, transactionInstance)

        await ImageTable.updateWithTransaction(image1Data, req.post.id, transactionInstance)

        await transactionInstance.commit()

        logger.debug(`post id ${req.post.id} row(s) ${count} updated`, {file: 'post.controller.js', function: 'putApiPostId', http: httpCodes.OK})

        return res
            .status(httpCodes.OK)
            .json({
                message: `La page du carnet à été mise à jour.`
            })
    }
    catch(exception)
    {
        await transactionInstance.rollback()

        logger.error(`Error when updating post id ${req.params.id} exception ${exception.message}`, {file: 'post.controller.js', function: 'putApiPostId', http: httpCodes.INTERNAL_SERVER_ERROR})

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `Une erreur est survenue lors de la mise à jour de la page du carnet.`,
            })
    }
}