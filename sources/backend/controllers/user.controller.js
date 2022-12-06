const db = require('../postgres')
const httpCodes = require('../httpCodes')
const jwt = require('jsonwebtoken')

exports.getApiUser = (req, res) =>
{
    db.User
        .findByPk(req.user_id)
        .then((user) =>
        {
            if(user)
            {
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
                console.error(`[ERROR] getApiUser - User id ${req.user_id} not found`)
    
                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `L'utilisateur numéro ${req.user_id} n'a pas été trouvé.`,
                    })
            }
        })
        .catch((exception) =>
        {
            console.error(`[ERROR] getApiUser ${req.user_id} - ${exception.message}`)
    
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche de l'utilisateur.`,
                })
        })
}

exports.postApiUser = (req, res) =>
{
    db.sequelize
        .transaction((transaction) =>
        {
            return db.User
                .create({
                    username: req.body.username,
                    email: req.body.email,
                    birthday: req.body.birthday || null,
                    sex: req.body.sex || null,
                    school: req.body.school,
                    schoolYear: req.body.schoolYear,
                    password: req.body.password
                },
                {
                    transaction: transaction
                })
        })
        .then((user) =>
        {
            console.log('[DEBUG] postApiUser new user created')
            console.log(user)

            return res
                .status(httpCodes.OK)
                .json({
                    message: `L'utilisateur ${req.body.username} a été enregistré.`
                })
        })
        .catch((exception) =>
        {
            console.error(`[ERROR] postApiUser ${req.body.username} ${req.body.email} ${req.body.password} - ${exception.message}`)

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
    userData.birthday = req.body.birthday || null
    userData.sex = req.body.sex || null
    req.body.school ? userData.school = req.body.school : ''
    req.body.schoolYear ? userData.schoolYear = req.body.schoolYear : ''

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
            console.log(`[DEBUG] putApiUser ${count} row(s) updated`)

            return res
                    .status(httpCodes.OK)
                    .json({
                        message: `Votre profil a été mis à jour.`
                    })
        })
        .catch((exception) =>
        {
            console.error(`[ERROR] putApiUser ${req.user_id} ${userData} - ${exception.message}`)

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
            console.log(`[DEBUG] postApiUserPasswordReset ${count} row(s) updated`)
  
            return res
                .status(httpCodes.OK)
                .json({
                    message: `Votre mot de passe à été mis à jour.`
                })
        })
        .catch((exception) =>
        {
            console.error(`[ERROR] postApiUserPasswordReset ${req.user_id} - ${exception.message}`)

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la mise à jour du mot de passe.`,
                })
        })
}