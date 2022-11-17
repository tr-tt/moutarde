const jwt = require('jsonwebtoken')
const path = require('path')
const config = require(path.resolve('setups', 'auth.config.js'))

verifyToken = (req, res, next) =>
{
    const token = req.headers['x-access-token']

    if (!token)
    {
        console.error('[ERROR] verifyToken - No token provided')

        return res.status(403).send({
            message: `L'accès à ces données est réservé aux utilisateurs enregistrés`,
        })
    }

    jwt.verify(token, config.secret, (err, decoded) =>
    {
        if (err)
        {
            console.error('[ERROR] verifyToken -Unauthorized')

            return res.status(401).send({
                message: `Vous n'avez pas accès à ces données`,
            })
        }
        
        req.userId = decoded.id

        next()
    })
}

const authJwt =
{
  verifyToken: verifyToken
}

module.exports = authJwt