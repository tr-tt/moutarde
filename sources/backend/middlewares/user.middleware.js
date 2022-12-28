const db = require('../postgres')
const httpCodes = require('../httpCodes')
const jwt = require('jsonwebtoken')
const logger = require('../logger')

jobExist = (req, res, next) =>
{
    if(req.body.job)
    {
        return next()
    }
    else
    {
        logger.warn(`no job provided`, {file: 'user.middleware.js', function: 'jobExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Une fonction est requise.`
            })
    }
}

emailOrUsernameExist = (req, res, next) =>
{
    if(req.body.emailOrUsername)
    {
        return next()
    }
    else
    {
        logger.warn(`no email or username provided`, {file: 'user.middleware.js', function: 'emailOrUsernameExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Une addresse email ou un nom d'utilisateur est requis.`
            })
    }
}

emailOrUsernameExistInDB = (req, res, next) =>
{
    db.User
        .findOne({
            where:
            {
                [db.Op.or]: [{username: req.body.emailOrUsername}, {email: req.body.emailOrUsername}]
            }
        })
        .then((user) =>
        {
            if(user)
            {
                req.user = user

                logger.debug(`user name or email ${req.body.emailOrUsername} found`, {file: 'user.middleware.js', function: 'emailOrUsernameExistInDB', http: httpCodes.OK})

                return next()
            }
            else
            {
                logger.warn(`user name or email ${req.body.emailOrUsername} not found`, {file: 'user.middleware.js', function: 'emailOrUsernameExistInDB', http: httpCodes.NOT_FOUND})

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `L'utilisateur avec l'addresse email ou le nom d'utilisateur ${req.body.emailOrUsername} n'a pas été trouvé.`
                    })
            }
        })
        .catch((exception) =>
        {
            logger.error(`user name or email ${req.body.emailOrUsername} exception ${exception.message}`, {file: 'user.middleware.js', function: 'emailOrUsernameExistInDB', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche de l'utilisateur pour changer le mot de passe.`
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
        logger.warn(`no username provided`, {file: 'user.middleware.js', function: 'usernameExist', http: httpCodes.BAD_REQUEST})

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
        logger.warn(`no email provided`, {file: 'user.middleware.js', function: 'emailExist', http: httpCodes.BAD_REQUEST})

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
        logger.warn(`no password provided`, {file: 'user.middleware.js', function: 'passwordExist', http: httpCodes.BAD_REQUEST})

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
        logger.warn(`no confirm password provided`, {file: 'user.middleware.js', function: 'confirmPasswordExist', http: httpCodes.BAD_REQUEST})

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
        logger.warn(`password ${req.body.password} confirm password ${req.body.confirmPassword} are not equal`, {file: 'user.middleware.js', function: 'passwordAndConfirmPasswordIdentity', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Le mot de passe de confirmation est différent du mot de passe.`,
            })
    }
}

userIdExist = (req, res, next) =>
{
    if(!req.params.id)
    {
        logger.warn(`no user id provided`, {file: 'user.middleware.js', function: 'userIdExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un id d'utilisateur est requis.`,
            })
    }

    db.User
        .findByPk(req.params.id)
        .then((user) =>
        {
            if(user)
            {
                req.user = user

                logger.debug(`user id ${req.params.id} user name ${user.username} found`, {file: 'user.middleware.js', function: 'userIdExist', http: httpCodes.OK})

                return next()
            }
            else
            {
                logger.warn(`user id ${req.params.id} not found`, {file: 'user.middleware.js', function: 'userIdExist', http: httpCodes.NOT_FOUND})

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `L'utilisateur n'a pas été trouvé.`,
                    })
            }
        }).catch((exception) =>
        {
            logger.error(`user id ${req.params.id} exception ${exception.message}`, {file: 'user.middleware.js', function: 'userIdExist', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche de l'utilisateur`,
                })
        })
}

usernameDuplicated = (req, res, next) =>
{
    if(!req.body.username)
    {
        return next()
    }

    db.User
        .findOne({
            where:
            {
                username: req.body.username
            }
        })
        .then((user) =>
        {
            if(user)
            {
                logger.warn(`user name ${req.body.username} already taken`, {file: 'user.middleware.js', function: 'usernameDuplicated', http: httpCodes.BAD_REQUEST})

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
        })
        .catch((exception) =>
        {
            logger.error(`user name ${req.body.username} exception ${exception.message}`, {file: 'user.middleware.js', function: 'usernameDuplicated', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la vérification de la duplication du nom d'utilisateur ${req.body.username}.`,
                })
        })
}

emailDuplicated = (req, res, next) =>
{
    if(!req.body.email)
    {
        return next()
    }

    db.User
        .findOne({
            where:
            {
                email: req.body.email
            }
        })
        .then((user) =>
        {
            if(user)
            {
                logger.warn(`user email ${req.body.email} already taken`, {file: 'user.middleware.js', function: 'emailDuplicated', http: httpCodes.BAD_REQUEST})

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
        })
        .catch((exception) =>
        {
            logger.error(`user email ${req.body.email} exception ${exception.message}`, {file: 'user.middleware.js', function: 'emailDuplicated', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la vérification de la duplication de l'adresse email ${req.body.email}.`
                })
        })
}

tokenExistVerify = (req, res, next) =>
{
    if(!req.params.token)
    {
        logger.warn(`no token provided`, {file: 'user.middleware.js', function: 'tokenExistVerify', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Vous devez envoyer une requête sur la plateforme avant d'avoir accès aux données.`,
            })
    }

    const secret = process.env.APP_SECRET + req.user.password

    jwt.verify(req.params.token, secret, (error, decoded) =>
    {
        if(error)
        {
            logger.error(`token ${req.params.token} invalid ${error}`, {file: 'user.middleware.js', function: 'tokenExistVerify', http: httpCodes.UNAUTHORIZED})

            return res
                .status(httpCodes.UNAUTHORIZED)
                .json({
                    message: `Votre accès aux données a expiré.`
                })
        }

        req.user_id = decoded.id

        return next()
    })
}

schoolExist = (req, res, next) =>
{
    if(req.body.school)
    {
        return next()
    }
    else
    {
        logger.warn(`no school provided`, {file: 'user.middleware.js', function: 'schoolExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un nom d'établissement scolaire est requis.`,
            })
    }
}

schoolYearExist = (req, res, next) =>
{
    if(req.body.schoolYear || req.body.job === 'Professeur')
    {
        return next()
    }
    else
    {
        logger.warn(`no school year provided`, {file: 'user.middleware.js', function: 'schoolYearExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Une année scolaire est requise.`,
            })
    }
}

seniorityExist = (req, res, next) =>
{
    if(req.body.seniority || req.body.job === 'Etudiant')
    {
        return next()
    }
    else
    {
        logger.warn(`no seniority provided`, {file: 'user.middleware.js', function: 'seniorityExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Une ancienneté en année(s) est requise.`,
            })
    }
}

const userMiddleware =
{
    jobExist,
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
    tokenExistVerify,
    schoolExist,
    schoolYearExist,
    seniorityExist
}

module.exports = userMiddleware