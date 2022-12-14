const db = require('../postgres')
const httpCodes = require('../httpCodes')
const jwt = require('jsonwebtoken')

userIdExist = (req, res, next) =>
{
    if(!req.params.id)
    {
        console.error('[ERROR] userIdExist - No user id provided')

        req.status = httpCodes.BAD_REQUEST

        return next()
    }

    db.User
        .findByPk(req.params.id)
        .then((user) =>
        {
            if(user)
            {
                req.status = httpCodes.OK
                req.user = user

                return next()
            }
            else
            {
                console.error(`[ERROR] userIdExist - User id ${req.params.id} not found`)

                req.status = httpCodes.NOT_FOUND

                return next()
            }
        }).catch((exception) =>
        {
            console.error(`[ERROR] userIdExist ${req.params.id} - ${exception.message}`)

            req.status = httpCodes.INTERNAL_SERVER_ERROR

            return next()
        })
}

postIdExist = (req, res, next) =>
{
    if(req.status !== httpCodes.OK)
    {
        return next()
    }
    
    if(!req.params.id)
    {
        console.error('[ERROR] postIdExist - No post id provided')

        req.status = httpCodes.BAD_REQUEST

        return next()
    }

    db.Post
        .findByPk(req.params.id)
        .then((post) =>
        {
            if(post)
            {
                req.status = httpCodes.OK
                req.post = post

                return next()
            }
            else
            {
                console.error(`[ERROR] postIdExist - Post id ${req.params.id} not found`)

                req.status = httpCodes.NOT_FOUND

                return next()
            }
        })
        .catch((exception) =>
        {
            console.error(`[ERROR] postIdExist ${req.params.id} - ${exception.message}`)

            req.status = httpCodes.INTERNAL_SERVER_ERROR

            return next()
        })
}

tokenExistVerify = (req, res, next) =>
{
    if(req.status !== httpCodes.OK)
    {
        return next()
    }

    if(!req.params.token)
    {
        console.error('[ERROR] tokenExistVerify - No token provided')

        req.status = httpCodes.FORBIDDEN

        return next()
    }

    const secret = process.env.APP_SECRET + req.user.password

    jwt.verify(req.params.token, secret, (error, decoded) =>
    {
        if(error)
        {
            console.error('[ERROR] tokenExistVerify - Unauthorized')

            req.status = httpCodes.UNAUTHORIZED

            return next()
        }

        req.status = httpCodes.OK
        req.user_id = decoded.id

        return next()
    })
}



const pageMiddleware =
{
    userIdExist,
    postIdExist,
    tokenExistVerify
}

module.exports = pageMiddleware