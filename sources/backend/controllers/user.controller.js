const db = require('../postgres')
const httpCodes = require('../httpCodes')
const jwt = require('jsonwebtoken')
const logger = require('../logger')
const transporter = require('../email')

exports.getApiUser = (req, res) =>
{
    db.User
        .findByPk(req.user_id)
        .then((user) =>
        {
            if(user)
            {
                logger.debug(`user id ${req.user_id} user name ${user.username} found`, {file: 'user.controller.js', function: 'getApiUser', http: httpCodes.OK})

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
                        message: `L'utilisateur numéro ${req.user_id} n'a pas été trouvé.`,
                    })
            }
        })
        .catch((exception) =>
        {
            logger.error(`user id ${req.user_id} exception ${exception.message}`, {file: 'user.controller.js', function: 'getApiUser', http: httpCodes.INTERNAL_SERVER_ERROR})
    
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
    userData.school = req.body.school
    userData.password = req.body.password

    userData.job === 'Etudiant' ? userData.schoolYear = req.body.schoolYear : ''
    userData.job === 'Professeur' ? userData.seniority = req.body.seniority : ''

    userData.birthday = req.body.birthday || null
    userData.sex = req.body.sex || ''

    const html =
    `
        <img src="https://mon-carnet-hercule.fr/static/images/logo_hercule.png" width="400px" draggable="false">

        <h1 style="font-size: 20px;color: #5f6368;">Bienvenu sur la plateforme HERCULE !</h1>

        <p style="font-size: 18px;text-align: justify;color: #5f6368;">Votre compte utilisateur a bien été crée, vous pouvez désormais vous connecter avec en cliquant sur le lien ci-dessous.</p>

        ${req.protocol}://${req.get('host')}/signin
    `

    const email =
    {
        from: process.env.EMAIL_USER,
        to: userData.email,
        subject: `Création du compte utilisateur.`,
        text: `Création du compte utilisateur.`,
        html: html
    }

    db.sequelize
        .transaction((transaction) =>
        {
            return db.User
                .create(userData,
                {
                    transaction: transaction
                })
        })
        .then((user) =>
        {
            logger.debug(`user name ${req.body.username} user email ${req.body.email} created`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.OK})

            transporter.sendMail(email, (error, info) =>
            {
                if(error)
                {
                    logger.error(`user id ${req.user.id} user email ${req.user.email} send email ${error}`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.INTERNAL_SERVER_ERROR})
                }
            })

            return res
                .status(httpCodes.OK)
                .json({
                    message: `L'utilisateur ${req.body.username} a été enregistré.`
                })
        })
        .catch((exception) =>
        {
            logger.error(`user name ${req.body.username} user email ${req.body.email} exception ${exception.message}`, {file: 'user.controller.js', function: 'postApiUser', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de l'enregistrement de l'utilisateur.`,
                })
        })
}

exports.putApiUser = (req, res) =>
{
    const userData = {}

    req.body.username ? userData.username = req.body.username : ''
    req.body.email ? userData.email = req.body.email : ''
    userData.school = req.body.school
    
    req.body.job === 'Etudiant' ? userData.schoolYear = req.body.schoolYear : ''
    req.body.job === 'Professeur' ? userData.seniority = req.body.seniority : ''

    userData.birthday = req.body.birthday || null
    userData.sex = req.body.sex || ''

    db.sequelize
        .transaction((transaction) =>
        {
            return db.User
                .update(userData,
                {
                    where:
                    {
                        id: req.user_id
                    }
                },
                {
                    transaction: transaction
                })
        })
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
            logger.error(`user id ${req.user_id} user data ${JSON.stringify(userData)} exception ${exception.message}`, {file: 'user.controller.js', function: 'putApiUser', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la mise à jour de l'utilisateur.`,
                })
        })
}

exports.deleteApiUserId = (req, res) =>
{
    db.sequelize
        .transaction((transaction) =>
        {
            return db.User
                .destroy({
                    where:
                    {
                        id: req.params.id
                    }
                },
                {
                    transaction: transaction
                })
        })
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
            logger.error(`user id ${req.params.id} exception ${exception.message}`, {file: 'user.controller.js', function: 'deleteApiUserId', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la suppression d'un compte utilisateur.`,
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

    const html =
    `
        <img src="https://mon-carnet-hercule.fr/static/images/logo_hercule.png" width="400px" draggable="false">

        <h1 style="font-size: 20px;color: #5f6368;">Votre demande de changement de mot de passe sur la plateforme HERCULE a été prise en compte.</h1>
        
        <p style="font-size: 18px;text-align: justify;color: #5f6368;">Vous pouvez cliquer sur le lien ci-dessous, valide pendant <strong style="color: #F8AC00;">quinze mintutes</strong>, pour proceder au changement.</p>

        ${link}
    `

    const email =
    {
        from: process.env.EMAIL_USER,
        to: req.user.email,
        subject: `Demande de réinitialisation de mot de passe.`,
        text: `Demande de réinitialisation de mot de passe.`,
        html: html
    }

    transporter.sendMail(email, (error, info) =>
    {
        if(error)
        {
            logger.error(`user id ${req.user.id} user email ${req.user.email} request password reset error ${error}`, {file: 'user.controller.js', function: 'postApiUserPasswordForgot', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la réinitialisation du mot de passe.`
                })
        }
        else
        {
            logger.debug(`user id ${req.user.id} user email ${req.user.email} request password reset`, {file: 'user.controller.js', function: 'postApiUserPasswordForgot', http: httpCodes.OK})

            return res
                .status(httpCodes.OK)
                .json({
                    message: `Un lien vous a été envoyé par email pour changer votre mot de passe (valide 15 min).`
                })
        }
    })   
}

exports.postApiUserPasswordReset = (req, res) =>
{
    db.sequelize
        .transaction((transaction) =>
        {
            return db.User
                .update({
                    password: req.body.password
                },
                {
                    where:
                    {
                        id: req.user_id
                    }
                },
                {
                    transaction: transaction
                })
        })
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
            logger.error(`user id ${req.user_id} exception ${exception.message}`, {file: 'user.controller.js', function: 'postApiUserPasswordReset', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la mise à jour du mot de passe.`,
                })
        })
}