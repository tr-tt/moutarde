const httpCodes = require('../httpCodes')
const logger = require('../logger')
const PostTable = require('../tables/post.table')

situationExist = (req, res, next) =>
{
    if(req.body.situation)
    {
        return next()
    }
    else
    {
        logger.warn(`no situation provided`, {file: 'post.middleware.js', function: 'situationExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Le champ "Situation vécue" est requis.`,
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
                message: `Un id de page de carnet est requis.`,
            })
    }

    PostTable
        .findById(req.params.id)
        .then((post) =>
        {
            if(post)
            {
                req.post = post

                logger.debug(`post ${post.Id} found`, {file: 'post.middleware.js', function: 'postIdExist', http: httpCodes.OK})

                return next()
            }
            else
            {
                logger.warn(`post id ${req.params.id} not found`, {file: 'post.middleware.js', function: 'postIdExist', http: httpCodes.NOT_FOUND})

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `La page de carnet n'a pas été trouvé.`,
                    })
            }
        })
        .catch((exception) =>
        {
            logger.error(`Error when finding post by id ${req.params.id} exception ${exception.message}`, {file: 'post.middleware.js', function: 'postIdExist', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche de la page de carnet`,
                })
        })
}

const postMiddleware =
{
    situationExist,
    postIdExist
}

module.exports = postMiddleware