const jwt = require('jsonwebtoken')
const httpCodes = require('../httpCodes')
const logger = require('../logger')

tokenExistVerify = (req, res, next) =>
{
    const token = req.cookies.access_token

    if(!token)
    {
        req.status = httpCodes.FORBIDDEN

        logger.warn(`no token provided`, {file: 'auth.middleware.js', function: 'tokenExistVerify', http: httpCodes.FORBIDDEN})

        return next()
    }

    jwt.verify(
        token,
        process.env.APP_SECRET,
        (error, decoded) =>
        {
            if(error)
            {
                req.status = httpCodes.UNAUTHORIZED

                logger.error(`token ${token} invalid ${error}`, {file: 'auth.middleware.js', function: 'tokenExistVerify', http: httpCodes.UNAUTHORIZED})

                return next()
            }
            
            req.user_id = decoded.id

            req.status = httpCodes.OK

            logger.debug(`user id ${decoded.id} token verified`, {file: 'auth.middleware.js', function: 'tokenExistVerify', http: httpCodes.OK})

            return next()
        }
    )
}

rejectIfBadToken = (req, res, next) =>
{
    switch(req.status)
    {
        case httpCodes.OK:
            return next()
        case httpCodes.FORBIDDEN:
            return res
                .status(httpCodes.FORBIDDEN)
                .json(
                    {
                        message: `Vous devez vous enregistrer sur la plateforme et vous connecter avant d'avoir accès aux données.`
                    }
                )
        case httpCodes.UNAUTHORIZED:
            return res
                .status(httpCodes.UNAUTHORIZED)
                .json(
                    {
                        message: `Votre accès aux données a expiré.`
                    }
                )
        default:
            logger.warn(`request status ${req.status} invalid`, {file: 'auth.middleware.js', function: 'rejectIfBadToken', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json(
                    {
                        message: `Une erreur est survenue lors de la vérification des accès.`
                    }
                )
    }
}

const authMiddleware =
{
    tokenExistVerify,
    rejectIfBadToken
}

module.exports = authMiddleware