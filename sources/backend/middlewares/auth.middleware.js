const jwt = require('jsonwebtoken')
const httpCodes = require('../httpCodes')

tokenExistVerify = (req, res, next) =>
{
    const token = req.cookies.access_token

    if(!token)
    {
        console.error('[ERROR] tokenExistVerify - No token provided')

        req.status = httpCodes.FORBIDDEN

        return next()
    }

    jwt.verify(token, process.env.APP_SECRET, (error, decoded) =>
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

rejectIfBadToken = (req, res, next) =>
{
    switch(req.status)
    {
        case httpCodes.OK:
            return next()
        case httpCodes.FORBIDDEN:
            return res
                .status(httpCodes.FORBIDDEN)
                .json({
                    message: `Vous devez vous enregistrer sur la plateforme et vous connecter avant d'avoir accès aux données.`
                })
        case httpCodes.UNAUTHORIZED:
            return res
                .status(httpCodes.UNAUTHORIZED)
                .json({
                    message: `Votre accès aux données a expiré.`
                })
        default:
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la vérification des accès.`
                })
    }
}

const authMiddleware =
{
    tokenExistVerify,
    rejectIfBadToken
}

module.exports = authMiddleware