const jwt = require('jsonwebtoken')
const path = require('path')
const config = require(path.resolve('setups', 'auth.config.js'))

verifyToken = (req, res, next) =>
{
    const token = req.headers['x-access-token']

    if (!token)
    {
        return res.status(403).send({
            message: '[ERROR] No token provided.',
            code: 6
        })
    }

    jwt.verify(token, config.secret, (err, decoded) =>
    {
        if (err)
        {
            return res.status(401).send({
                message: '[ERROR] Unauthorized.',
                code: 7
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