const db = require('../postgres')
const httpCodes = require('../httpCodes')

usernameExist = (req, res, next) =>
{
    if(req.body.username)
    {
        next()
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
        next()
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
        next()
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

                next()
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
                next()
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
        next()
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
                next()
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
        next()
    }
}

const userMiddleware =
{
    usernameExist,
    emailExist,
    passwordExist,
    userIdExist,
    usernameDuplicated,
    emailDuplicated
}

module.exports = userMiddleware