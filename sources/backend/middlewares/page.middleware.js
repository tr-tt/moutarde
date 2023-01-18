const db = require('../postgres')
const httpCodes = require('../httpCodes')
const jwt = require('jsonwebtoken')
const logger = require('../logger')

userIdExist = (req, res, next) =>
{
    if(!req.params.id)
    {
        req.status = httpCodes.BAD_REQUEST

        logger.warn(`no user id provided`, {file: 'page.middleware.js', function: 'userIdExist', http: httpCodes.BAD_REQUEST})

        return next()
    }

    db.User
        .findByPk(req.params.id)
        .then(
            (user) =>
            {
                if(user)
                {
                    req.user = user

                    req.status = httpCodes.OK

                    logger.debug(`user id ${req.params.id} found`, {file: 'page.middleware.js', function: 'userIdExist', http: httpCodes.OK})

                    return next()
                }
                else
                {
                    req.status = httpCodes.NOT_FOUND

                    logger.warn(`user id ${req.params.id} not found`, {file: 'page.middleware.js', function: 'userIdExist', http: httpCodes.NOT_FOUND})

                    return next()
                }
            }
        )
        .catch(
            (exception) =>
            {
                req.status = httpCodes.INTERNAL_SERVER_ERROR

                logger.error(`user id ${req.params.id} exception ${exception.message}`, {file: 'page.middleware.js', function: 'userIdExist', http: httpCodes.INTERNAL_SERVER_ERROR})

                return next()
            }
        )
}

postIdExist = (req, res, next) =>
{
    if(req.status !== httpCodes.OK)
    {
        return next()
    }
    
    if(!req.params.id)
    {
        req.status = httpCodes.BAD_REQUEST

        logger.warn(`no post id provided`, {file: 'page.middleware.js', function: 'postIdExist', http: httpCodes.BAD_REQUEST})

        return next()
    }

    db.Post
        .findByPk(req.params.id)
        .then(
            (post) =>
            {
                if(post)
                {
                    req.post = post

                    req.status = httpCodes.OK
                    
                    logger.debug(`post id ${req.params.id} found`, {file: 'page.middleware.js', function: 'postIdExist', http: httpCodes.OK})

                    return next()
                }
                else
                {
                    req.status = httpCodes.NOT_FOUND

                    logger.warn(`post id ${req.params.id} not found`, {file: 'page.middleware.js', function: 'postIdExist', http: httpCodes.NOT_FOUND})

                    return next()
                }
            }
        )
        .catch(
            (exception) =>
            {
                req.status = httpCodes.INTERNAL_SERVER_ERROR

                logger.error(`post id ${req.params.id} exception ${exception.message}`, {file: 'page.middleware.js', function: 'postIdExist', http: httpCodes.INTERNAL_SERVER_ERROR})

                return next()
            }
        )
}

tokenExistVerify = (req, res, next) =>
{
    if(req.status !== httpCodes.OK)
    {
        return next()
    }

    if(!req.params.token)
    {
        req.status = httpCodes.FORBIDDEN

        logger.warn(`no token provided`, {file: 'page.middleware.js', function: 'tokenExistVerify', http: httpCodes.FORBIDDEN})

        return next()
    }

    const secret = process.env.APP_SECRET + req.user.password

    jwt.verify(
        req.params.token,
        secret,
        (error, decoded) =>
        {
            if(error)
            {
                logger.error(`user id ${req.user.id} user name ${req.user.username}'s token ${req.params.token} invalid ${error}`, {file: 'page.middleware.js', function: 'tokenExistVerify', http: httpCodes.UNAUTHORIZED})

                req.status = httpCodes.UNAUTHORIZED

                return next()
            }

            req.user_id = decoded.id

            req.status = httpCodes.OK

            logger.debug(`user id ${decoded.id}'s token ${req.params.token} authorized`, {file: 'page.middleware.js', function: 'tokenExistVerify', http: httpCodes.OK})

            return next()
        }
    )
}



const pageMiddleware =
{
    userIdExist,
    postIdExist,
    tokenExistVerify
}

module.exports = pageMiddleware