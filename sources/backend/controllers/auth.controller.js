const db = require('../postgres')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const httpCodes = require('../httpCodes')
const logger = require('../logger')

exports.postApiAuthSignin = (req, res) =>
{
    db.User
        .findOne({
            where:
            {
                username: req.body.username
            }
        })
        .then((user) =>
        {
            if (!user)
            {
                logger.warn(`user name ${req.body.username} not found`, {file: 'auth.controller.js', function: 'postApiAuthSignin', http: httpCodes.NOT_FOUND})

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `L'utilisateur ${req.body.username} n'a pas été trouvé.`,
                    })
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            )

            if (!passwordIsValid)
            {
                logger.error(`user name ${req.body.username}'s password ${req.body.password} is invalid`, {file: 'auth.controller.js', function: 'postApiAuthSignin', http: httpCodes.UNAUTHORIZED})

                return res
                    .status(httpCodes.UNAUTHORIZED)
                    .json({
                        message: 'Le mot de passe est invalide.',
                    })
            }

            const payload =
            {
                id: user.id
            }
            const token = jwt.sign(payload, process.env.APP_SECRET, {expiresIn: '4h'})

            logger.debug(`user name ${req.body.username} logged in`, {file: 'auth.controller.js', function: 'postApiAuthSignin', http: httpCodes.OK})

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
        })
        .catch((exception) =>
        {
            logger.error(`user name ${req.body.username} password ${req.body.password} exception ${exception.message}`, {file: 'auth.controller.js', function: 'postApiAuthSignin', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Impossible de se connceter avec l'utilisateur ${req.body.username}.`
                })
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