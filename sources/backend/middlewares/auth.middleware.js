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

    jwt.verify(token, process.env.APP_SECRET, (err, decoded) =>
    {
        if(err)
        {
            console.error('[ERROR] tokenExistVerify - Unauthorized')

            req.status = httpCodes.UNAUTHORIZED

            return next()
        }
        
        req.status = httpCodes.OK
        req.user_id = decoded.id

        next()
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
                    message: `L'accès aux données est réservé aux utilisateurs connectés.`
                })
        case httpCodes.UNAUTHORIZED:
            return res
                .status(httpCodes.UNAUTHORIZED)
                .json({
                    message: `Vous n'avez pas accès à ces données.`
                })
        default:
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur interne s'est produite.`
                })
    }
}

const authMiddleware =
{
    tokenExistVerify,
    rejectIfBadToken
}

module.exports = authMiddleware