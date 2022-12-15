const db = require('../postgres')
const httpCodes = require('../httpCodes')
const jwt = require('jsonwebtoken')
const logger = require('../logger')

exports.getApiUser = (req, res) =>
{
    db.User
        .findByPk(req.user_id)
        .then((user) =>
        {
            if(user)
            {
                logger.debug(`user id ${req.user_id} user name ${user.username} found`, {file: 'user.controller.js', function: 'getApiUser', http: httpCodes.OK})

                return res
                    .status(httpCodes.OK)
                    .json({
                        message: 
                        {
                            username: user.username,
                            email: user.email,
                            birthday: user.birthday,
                            sex: user.sex,
                            school: user.school,
                            schoolYear: user.schoolYear
                        }
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

    userData.username = req.body.username
    userData.email = req.body.email
    userData.school = req.body.school
    userData.schoolYear = req.body.schoolYear
    userData.password = req.body.password

    userData.birthday = req.body.birthday || null
    userData.sex = req.body.sex || null

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
    userData.schoolYear = req.body.schoolYear

    userData.birthday = req.body.birthday || null
    userData.sex = req.body.sex || null

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

    console.log(link)
    // TODO : Send this link to the user email.

    logger.debug(`user id ${req.user.id} user email ${req.user.email} request password reset`, {file: 'user.controller.js', function: 'postApiUserPasswordForgot', http: httpCodes.OK})

    return res
        .status(httpCodes.OK)
        .json({
            message: 'Un lien vous a été envoyé dans votre boite email pour changer votre mot de passe.'
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