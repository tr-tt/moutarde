const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const httpCodes = require('../httpCodes')
const logger = require('../logger')

exports.getApiAuthSignin = (req, res) =>
{
    return res
        .status(httpCodes.OK)
        .json({
            message: `Vous êtes connecté.`
        })
}

exports.postApiAuthSignin = (req, res) =>
{
    const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        req.user.password
    )

    if (!passwordIsValid)
    {
        logger.error(`username or email ${req.body.emailOrUsername}'s password ${req.body.password} is invalid`, {file: 'auth.controller.js', function: 'postApiAuthSignin', http: httpCodes.UNAUTHORIZED})

        return res
            .status(httpCodes.UNAUTHORIZED)
            .json({
                message: 'Le mot de passe est invalide.',
            })
    }

    const payload =
    {
        id: req.user.id
    }

    const token = jwt.sign(payload, process.env.APP_SECRET, {expiresIn: '4h'})

    logger.debug(`username or email ${req.body.emailOrUsername} logged in`, {file: 'auth.controller.js', function: 'postApiAuthSignin', http: httpCodes.OK})

    return res
        .cookie('access_token', token,
        {
            httpOnly: true,
            SameSite: true,
            maxAge: 4 * 60 * 60 * 1000 // 4 hours
        })
        .status(httpCodes.OK)
        .json({
            message: 'Vous êtes connecté.'
        })
}

exports.getApiAuthSignout = (req, res) =>
{
    return res
        .clearCookie('access_token')
        .status(httpCodes.OK)
        .json({
            message: 'Vous êtes déconnecté.'
        })
}