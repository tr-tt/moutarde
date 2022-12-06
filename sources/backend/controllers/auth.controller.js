const db = require('../postgres')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const httpCodes = require('../httpCodes')

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
                console.error(`[ERROR] postApiAuthSignin user ${req.body.username} not found`)

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
                console.error(`[ERROR] postApiAuthSignin user ${req.body.username} password ${req.body.password} invalid`)

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
            console.error(`[ERROR] postApiAuthSignin user ${req.body.username} password ${req.body.password} - ${exception.message}`)

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