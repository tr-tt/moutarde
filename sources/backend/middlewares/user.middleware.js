const httpCodes = require('../httpCodes')
const jwt = require('jsonwebtoken')
const logger = require('../logger')
const UserTable = require('../tables/user.table')

jobExist = (req, res, next) =>
{
    if(req.body.job)
    {
        if(req.body.job === 'Etudiant')
        {
            return next()
        }
        else if(req.body.job === 'Enseignant')
        {
            return next()
        }
        else
        {
            logger.warn(`job ${req.body.job} invalid`, {file: 'user.middleware.js', function: 'jobExist', http: httpCodes.BAD_REQUEST})

            return res
                .status(httpCodes.BAD_REQUEST)
                .json({
                    message: `La fonction ${req.body.job} est invalide.`
                })
        }
    }
    else
    {
        logger.warn(`no job provided`, {file: 'user.middleware.js', function: 'jobExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Le champ "Fonction" est requis.`
            })
    }
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
                message: `Le champ "Nom d'utilisateur" est requis.`,
            })
    }
}

usernameDuplicated = (req, res, next) =>
{
    if(!req.body.username)
    {
        return next()
    }

    UserTable
        .findByUsername(req.body.username)
        .then((user) =>
        {
            if(user)
            {
                logger.warn(`username ${req.body.username} is already taken`, {file: 'user.middleware.js', function: 'usernameDuplicated', http: httpCodes.BAD_REQUEST})

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
            logger.error(`Error when finding user by username ${req.body.username} exception ${exception.message}`, {file: 'user.middleware.js', function: 'usernameDuplicated', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la vérification de la duplication du nom d'utilisateur ${req.body.username}.`,
                })
        })
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
                message: `Le champ "Addresse email" est requis.`,
            })
    }
}

emailDuplicated = async (req, res, next) =>
{
    if(!req.body.email)
    {
        return next()
    }

    UserTable
        .findByEmail(req.body.email)
        .then((user) =>
        {
            if(user)
            {
                logger.warn(`user email ${req.body.email} is already taken`, {file: 'user.middleware.js', function: 'emailDuplicated', http: httpCodes.BAD_REQUEST})

                return res
                    .status(httpCodes.BAD_REQUEST)
                    .json({
                        message: `L'adresse email ${req.body.email} est déjà utilisée.`,
                    })
            }
            else
            {
                return next()
            }
        })
        .catch((exception) =>
        {
            logger.error(`Error when finding user by email ${req.body.email} exception ${exception.message}`, {file: 'user.middleware.js', function: 'emailDuplicated', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la vérification de la duplication de l'adresse email ${req.body.email}.`,
                })
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
                message: `Le champ "Etablissement scolaire" est requis.`,
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
                message: `Le champ "Mot de passe" est requis.`,
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
                message: `Le champ "Confirmation du mot de passe" est requis.`,
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
                message: `Attention, votre mot de passe est différent du mot de passe de confirmation.`,
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
    if(!req.body.emailOrUsername)
    {
        return next()
    }

    UserTable
        .findByEmailOrUsername(req.body.emailOrUsername)
        .then((user) =>
        {
            if(user)
            {
                req.user = user

                logger.debug(`username or email ${req.body.emailOrUsername} found`, {file: 'user.middleware.js', function: 'emailOrUsernameExistInDB', http: httpCodes.OK})

                return next()
            }
            else
            {
                logger.warn(`username or email ${req.body.emailOrUsername} not found`, {file: 'user.middleware.js', function: 'emailOrUsernameExistInDB', http: httpCodes.NOT_FOUND})

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `L'utilisateur avec l'addresse email ou le nom d'utilisateur ${req.body.emailOrUsername} n'a pas été trouvé.`
                    })
            }
        })
        .catch((exception) =>
        {
            logger.error(`Error when finding user by username or email ${req.body.emailOrUsername} exception ${exception.message}`, {file: 'user.middleware.js', function: 'emailOrUsernameExistInDB', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche de l'utilisateur avec l'adresse email ou le nom d'utilisateur.`
                })
        })
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

    UserTable
        .findById(req.params.id)
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
        })
        .catch((exception) =>
        {
            logger.error(`Error when finding user by id ${req.params.id} exception ${exception.message}`, {file: 'user.middleware.js', function: 'userIdExist', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche de l'utilisateur`,
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

const userMiddleware =
{
    jobExist,
    usernameExist,
    usernameDuplicated,
    emailExist,
    emailDuplicated,
    schoolExist,
    passwordExist,
    confirmPasswordExist,
    passwordAndConfirmPasswordIdentity,
    emailOrUsernameExist,
    emailOrUsernameExistInDB,
    userIdExist,
    tokenExistVerify
}

module.exports = userMiddleware