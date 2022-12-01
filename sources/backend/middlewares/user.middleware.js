const db = require('../postgres')
const httpCodes = require('../httpCodes')
const jwt = require('jsonwebtoken')

emailOrUsernameExist = (req, res, next) =>
{
    if(req.body.emailOrUsername)
    {
        return next()
    }
    else
    {
        console.error('[ERROR] emailOrUsernameExist - No email or username provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Une addresse email ou un nom d'utilisateur est requis.`
            })
    }
}

emailOrUsernameExistInDB = (req, res, next) =>
{
    db.User.findOne({
        where:
        {
            username: req.body.emailOrUsername
        }
    }).then((user) =>
    {
        if(user)
        {
            req.user = user

            return next()
        }
        else
        {
            db.User.findOne({
                where:
                {
                    email: req.body.emailOrUsername
                }
            }).then((user) =>
            {
                if(user)
                {
                    req.user = user

                    return next()
                }
                else
                {
                    console.error(`[ERROR] emailOrUsernameExistInDB ${req.body.emailOrUsername} not found`)

                    return res
                        .status(httpCodes.NOT_FOUND)
                        .json({
                            message: `L'utilisateur avec cette addresse email ou ce nom d'utilisateur ${req.body.emailOrUsername} n'a pas été trouvé.`
                        })
                }
            })
        }
    }).catch((exception) =>
    {
        console.error(`[ERROR] emailOrUsernameExistInDB ${req.body.emailOrUsername} - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `L'addresse email ou le nom d'utilisateur ${req.body.emailOrUsername} est invalide.`
            })
    })
}


usernameExist = (req, res, next) =>
{
    if(req.body.username)
    {
        return next()
    }
    else
    {
        console.error('[ERROR] userameExist - No username provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Le nom d'utilisateur est requis.`,
            })
    }
}

emailExist = (req, res, next) =>
{
    if(req.body.email)
    {
        return next()
    }
    else
    {
        console.error('[ERROR] emailExist - No email provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Une adresse email est requise.`,
            })
    }
}

passwordExist = (req, res, next) =>
{
    if(req.body.password)
    {
        return next()
    }
    else
    {
        console.error('[ERROR] passwordExist - No password provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un mot de passe est requis.`,
            })
    }
}

confirmPasswordExist = (req, res, next) =>
{
    if(req.body.confirmPassword)
    {
        return next()
    }
    else
    {
        console.error('[ERROR] confirmPasswordExist - No confirm password provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un mot de passe de confirmation est requis.`,
            })
    }
}

passwordAndConfirmPasswordIdentity = (req, res, next) =>
{
    if(req.body.password === req.body.confirmPassword)
    {
        return next()
    }
    else
    {
        console.error(`[ERROR] passwordAndConfirmPasswordIdentity - ${req.body.password} != ${req.body.confirmPassword}`)

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Le mot de passe de confirmation est différent du mot de passe.`,
            })
    }
}

userIdExist = (req, res, next) =>
{
    if(req.params.id)
    {
        db.User.findOne({
            where:
            {
                id: req.params.id
            }
        }).then((user) =>
        {
            if(user)
            {
                req.user = user

                return next()
            }
            else
            {
                console.error(`[ERROR] userIdExist - User id ${req.params.id} not found`)

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `L'utilisateur numéro ${req.params.id} n'a pas été trouvé.`,
                    })
            }
        }).catch((exception) =>
        {
            console.error(`[ERROR] userIdExist ${req.params.id} - ${exception.message}`)

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Le numéro ${req.params.id} est invalide.`,
                })
        })
    }
    else
    {
        console.error('[ERROR] userIdExist - No user id provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un id d'utilisateur est requis.`,
            })
    }
}

usernameDuplicated = (req, res, next) =>
{
    if(req.body.username)
    {
        db.User.findOne({
            where:
            {
                username: req.body.username
            }
        }).then((user) =>
        {
            if (user)
            {
                console.error(`[ERROR] usernameDuplicated - Username ${req.body.username} already taken`)

                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({
                        message: `Le nom d'utilisateur ${req.body.username} est déjà utilisé.`,
                    })
            }
            else
            {
                return next()
            }
        }).catch((exception) =>
        {
            console.error(`[ERROR] usernameDuplicated ${req.body.username} - ${exception.message}`)

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Le nom d'utilisateur ${req.body.username} est invalide.`,
                })
        })
    }
    else
    {
        return next()
    }
}

emailDuplicated = (req, res, next) =>
{
    if(req.body.email)
    {
        db.User.findOne({
            where:
            {
                email: req.body.email
            }
        }).then((user) =>
        {
            if (user)
            {
                console.error(`[ERROR] emailDuplicated - Email ${req.body.email} already taken`)

                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({
                        message: `L'adresse email ${req.body.email} est déjà utilisée.`
                    })
            }
            else
            {
                return next()
            }
        }).catch((exception) =>
        {
            console.error(`[ERROR] emailDuplicated ${req.body.email} - ${exception.message}`)

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `L'adresse email ${req.body.email} est invalide.`
                })
        })
    }
    else
    {
        return next()
    }
}

tokenExistVerify = (req, res, next) =>
{
    if(req.params.token)
    {
        const secret = process.env.APP_SECRET + req.user.password

        jwt.verify(req.params.token, secret, (error, decoded) =>
        {
            if(error)
            {
                console.error('[ERROR] tokenExistVerify - Unauthorized')

                return res
                    .status(httpCodes.UNAUTHORIZED)
                    .json({
                        message: `Votre temps d'accès a expiré.`
                    })
            }

            req.user_id = decoded.id

            return next()

        })
    }
    else
    {
        console.error('[ERROR] tokenExistVerify - No token provided')

        return res
            .status(httpCodes.FORBIDDEN)
            .json({
                message: `Un token utilisateur est requis.`,
            })
    }
}

const userMiddleware =
{
    emailOrUsernameExist,
    usernameExist,
    emailOrUsernameExistInDB,
    emailExist,
    passwordExist,
    confirmPasswordExist,
    passwordAndConfirmPasswordIdentity,
    userIdExist,
    usernameDuplicated,
    emailDuplicated,
    tokenExistVerify
}

module.exports = userMiddleware