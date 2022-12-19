const db = require('../postgres')
const httpCodes = require('../httpCodes')
const logger = require('../logger')

titleExist = (req, res, next) =>
{
    if(req.body.title)
    {
        return next()
    }
    else
    {
        logger.warn(`no title provided`, {file: 'post.middleware.js', function: 'titleExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Titre de la situation vécue est requis.`,
            })
    }
}

toolExist = (req, res, next) =>
{
    if(req.body.tool)
    {
        return next()
    }
    else
    {
        logger.warn(`no tool provided`, {file: 'post.middleware.js', function: 'toolExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Outil cible utilisé est requis.`,
            })
    }
}

postIdExist = (req, res, next) =>
{   
    if(!req.params.id)
    {
        logger.warn(`no post id provided`, {file: 'post.middleware.js', function: 'postIdExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un id de formulaire est requis.`,
            })
    }

    db.Post
        .findByPk(req.params.id)
        .then((post) =>
        {
            if(post)
            {
                req.post = post

                logger.debug(`post id ${req.params.id} found`, {file: 'post.middleware.js', function: 'postIdExist', http: httpCodes.OK})

                return next()
            }
            else
            {
                logger.warn(`post id ${req.params.id} not found`, {file: 'post.middleware.js', function: 'postIdExist', http: httpCodes.NOT_FOUND})

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `Le formulaire n'a pas été trouvé.`,
                    })
            }
        })
        .catch((exception) =>
        {
            logger.error(`post id ${req.params.id} exception ${exception.message}`, {file: 'post.middleware.js', function: 'postIdExist', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche du formulaire`,
                })
        })
}

descriptionExist = (req, res, next) =>
{
    if(req.body.description)
    {
        return next()
    }
    else
    {
        logger.warn(`no description provided`, {file: 'post.middleware.js', function: 'descriptionExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Description de la situation est requis.`,
            })
    }
}

difficultyExist = (req, res, next) =>
{
    if(req.body.difficulty)
    {
        return next()
    }
    else
    {
        logger.warn(`no difficulty provided`, {file: 'post.middleware.js', function: 'difficultyExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Difficulté et/ou satisfaction rencontrées est requis.`,
            })
    }
}

const postMiddleware =
{
    titleExist,
    toolExist,
    postIdExist,
    descriptionExist,
    difficultyExist
}

module.exports = postMiddleware