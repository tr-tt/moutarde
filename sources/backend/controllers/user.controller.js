const httpCodes = require('../httpCodes')
const jwt = require('jsonwebtoken')
const logger = require('../logger')
const mailer = require('../email')
const UserTable = require('../tables/user.table')

exports.getApiUser = (req, res) =>
{
    UserTable
        .findById(req.user_id)
        .then((user) =>
        {
            if(user)
            {
                logger.debug(`user id ${req.user_id} username ${user.username} found`, {file: 'user.controller.js', function: 'getApiUser', http: httpCodes.OK})

                user.dataValues.createdAt && delete user.dataValues.createdAt
                user.dataValues.updatedAt && delete user.dataValues.updatedAt
                user.dataValues.password && delete user.dataValues.password

                return res
                    .status(httpCodes.OK)
                    .json({
                        message: user
                    })
            }
            else
            {
                logger.warn(`user id ${req.user_id} not found`, {file: 'user.controller.js', function: 'getApiUser', http: httpCodes.NOT_FOUND})
    
                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `L'utilisateur n'a pas été trouvé.`,
                    })
            }
        })
        .catch((exception) =>
        {
            logger.error(`Error when finding user by id ${req.user_id} exception ${exception.message}`, {file: 'user.controller.js', function: 'getApiUser', http: httpCodes.INTERNAL_SERVER_ERROR})
    
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche de l'utilisateur.`,
                })
        })
}

exports.postApiUser = (req, res) =>
{
    const userData = {}

    userData.job = req.body.job
    userData.username = req.body.username
    userData.email = req.body.email
    userData.lastname = req.body.lastname || ''
    userData.firstname = req.body.firstname || ''
    userData.birthday = req.body.birthday || null
    userData.sex = req.body.sex || ''
    userData.school = req.body.school
    userData.schoolYear = userData.job === 'Etudiant' ? req.body.schoolYear : ''
    userData.seniority = userData.job === 'Enseignant' ?  req.body.seniority : ''
    userData.password = req.body.password

    UserTable
    .create(userData)
    .then(async (user) =>
    {
        logger.debug(`User ${JSON.stringify(user, null, 2)} created`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.OK})

        await mailer
            .sendAccountCreated(
                {
                    username: user.username,
                    email: user.email,
                    link: `${req.protocol}://${req.get('host')}/signin`
                }
            )
            .then((result) =>
            {
                logger.debug(`Email sent to ${user.email} result ${JSON.stringify(result, null, 2)}`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.OK}) 
        
                return res
                    .status(httpCodes.OK)
                    .json({
                        message: `L'utilisateur ${user.username} a été enregistré.`
                    })
            })
            .catch((exception) =>
            {
                logger.error(`Error when sending email to ${user.email} exception ${exception.message}`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.INTERNAL_SERVER_ERROR})
        
                return res
                    .status(httpCodes.INTERNAL_SERVER_ERROR)
                    .json({
                        message: `Une erreur est survenue lors de l'envoi de l'email de confirmation de l'enregistrement de l'utilisateur.`,
                    })
            })
    })
    .catch((exception) =>
    {
        logger.error(`Error when creating new user username ${req.body.username} user email ${req.body.email} exception ${exception.message}`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.INTERNAL_SERVER_ERROR})

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `Une erreur est survenue lors de l'enregistrement de l'utilisateur.`,
            })
    })

    /*UserTable
        .create(userData)
        .then(async (user) =>
        {
            logger.debug(`User ${JSON.stringify(user, null, 2)} created`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.OK})
    
            try
            {
                const result = await mailer.sendAccountCreated({username: user.username, email: user.email, link: `${req.protocol}://${req.get('host')}/signin`})

                logger.debug(`Email sent to ${user.email} result ${JSON.stringify(result, null, 2)}`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.OK}) 
            
                return res
                    .status(httpCodes.OK)
                    .json({
                        message: `L'utilisateur ${user.username} a été enregistré.`
                    })
            }
            catch(exception)
            {
                logger.error(`Error when sending email to ${user.email} exception ${exception.message}`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.INTERNAL_SERVER_ERROR})
            
                return res
                    .status(httpCodes.INTERNAL_SERVER_ERROR)
                    .json({
                        message: `Une erreur est survenue lors de l'envoi de l'email de confirmation de l'enregistrement de l'utilisateur.`,
                    })
            }
        })
        .catch((exception) =>
        {
            logger.error(`Error when creating new user username ${req.body.username} user email ${req.body.email} exception ${exception.message}`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de l'enregistrement de l'utilisateur.`,
                })
        })*/
}

exports.putApiUser = (req, res) =>
{
    const userData = {}

    req.body.username ? userData.username = req.body.username : ''
    req.body.email ? userData.email = req.body.email : ''
    userData.lastname = req.body.lastname || ''
    userData.firstname = req.body.firstname || ''
    userData.birthday = req.body.birthday || null
    userData.sex = req.body.sex || ''
    userData.school = req.body.school
    userData.schoolYear = req.body.job === 'Etudiant' ? req.body.schoolYear : ''
    userData.seniority = req.body.job === 'Enseignant' ?  req.body.seniority : ''

    UserTable
        .update(userData, req.user_id)
        .then((count) =>
        {
            logger.debug(`user id ${req.user_id} row(s) ${count} updated`, {file: 'user.controller.js', function: 'putApiUser', http: httpCodes.OK})

            return res
                .status(httpCodes.OK)
                .json({
                    message: `Votre profil a été mis à jour.`
                })
        })
        .catch((exception) =>
        {
            logger.error(`Error when updating user by id ${req.user_id} user data ${JSON.stringify(userData, null, 2)} exception ${exception.message}`, {file: 'user.controller.js', function: 'putApiUser', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la mise à jour de l'utilisateur.`,
                })
        })
}

exports.deleteApiUserId = (req, res) =>
{
    UserTable
        .delete(req.params.id)
        .then((count) =>
        {
            logger.debug(`user id ${req.params.id} row(s) ${count} deleted`, {file: 'user.controller.js', function: 'deleteApiUserId', http: httpCodes.OK})

            return res
                .status(httpCodes.OK)
                .json({
                    message: `Le compte utilisateur a été supprimé.`
                })
        })
        .catch((exception) =>
        {
            logger.error(`Error when deleting user by id ${req.params.id} exception ${exception.message}`, {file: 'user.controller.js', function: 'deleteApiUserId', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la suppression du compte utilisateur.`,
                })
        })
}

exports.postApiUserPasswordForgot = (req, res) =>
{
    const secret = process.env.APP_SECRET + req.user.password
    const payload =
    {
        id: req.user.id,
        email: req.user.email
    }
    const token = jwt.sign(payload, secret, {expiresIn: '15m'})

    const link = `${req.protocol}://${req.get('host')}/password/reset/${req.user.id}/${token}`

    mailer
        .sendPasswordLink(
            {
                email: req.user.email,
                link: link
            }
        )
        .then((result) =>
        {
            logger.debug(`Email sent to ${req.user.email} result ${JSON.stringify(result, null, 2)}`, {file: 'user.controller.js', function: 'postApiUserPasswordForgot', http: httpCodes.OK})

            return res
                .status(httpCodes.OK)
                .json({
                    message: `Un lien vous a été envoyé par email pour changer votre mot de passe (valide 15 min).`
                })
        })
        .catch((exception) =>
        {
            logger.error(`Error when sending email to ${req.user.email} exception ${exception.message}`, {file: 'user.controller.js', function: 'postApiUserPasswordForgot', http: httpCodes.INTERNAL_SERVER_ERROR})
        
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la réinitialisation du mot de passe.`
                })
        })
}

exports.postApiUserPasswordReset = (req, res) =>
{
    UserTable
        .update({password: req.body.password}, req.user_id)
        .then((count) =>
        {
            logger.debug(`user id ${req.user_id} password row(s) ${count} updated`, {file: 'user.controller.js', function: 'postApiUserPasswordReset', http: httpCodes.OK})
  
            return res
                .status(httpCodes.OK)
                .json({
                    message: `Votre mot de passe à été mis à jour.`
                })
        })
        .catch((exception) =>
        {
            logger.error(`Error when updating password user id ${req.user_id} exception ${exception.message}`, {file: 'user.controller.js', function: 'postApiUserPasswordReset', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la mise à jour du mot de passe.`,
                })
        })
}