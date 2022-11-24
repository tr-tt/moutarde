const db = require('../postgres')
const httpCodes = require('../httpCodes')
const bcrypt = require('bcryptjs')

const checkExistUserData = (req) =>
{
    const updateData = {}

    if(req.body.username)
    {
        updateData.username = req.body.username
    }

    if(req.body.email)
    {
        updateData.email = req.body.email
    }

    if(req.body.password)
    {
        updateData.password = bcrypt.hashSync(req.body.password, 8)
    }

    return updateData
}

//===============================================//
// REST api for USERS
//===============================================//

exports.getApiUsers = (req, res) =>
{
    db.User.findAll().then((users) =>
    {
        return res
            .status(httpCodes.OK)
            .json({
                message: users
            })
    }).catch((exception) =>
    {
        console.error(`[ERROR] getApiUsers - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `Impossible d'accéder aux données utilisateur.`,
            })
    })
}

exports.getApiUsersId = (req, res) =>
{
    return res
        .status(httpCodes.OK)
        .json({
            message: req.user
        })
}

exports.postApiUsers = (req, res) =>
{
    db.User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then((user) =>
    {
        console.log('[DEBUG] postApiUsers new user created')
        console.log(user)

        return res
            .status(httpCodes.OK)
            .json({
                message: `L'utilisateur ${req.body.username} a été enregistré.`
            })
    }).catch((exception) =>
    {
        console.error(`[ERROR] postApiUsers ${req.body.username} ${req.body.email} ${req.body.password} - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `L'utilisateur ${req.body.username} n'a pas pu être enregistré.`,
            })
    })
}

exports.putApiUsersId = (req, res) =>
{
    const userData = checkExistUserData(req)

    db.User.update(userData,
    {
        where:
        {
            id: req.params.id
        }
    }).then((count) =>
    {
        console.log(`[DEBUG] putApiUsersId ${count} row(s) updated`)

        if(count != '0')
        {
            return res
                .status(httpCodes.OK)
                .json({
                    message: `L'utilisateur numéro ${req.params.id} a été mis à jour.`
                })
        }
        else
        {
            return res
                .status(httpCodes.OK)
                .json({
                    message: `L'utilisateur numéro ${req.params.id} est déjà à jour.`
                })
        }
        
    }).catch((exception) =>
    {
        console.error(`[ERROR] putApiUsersId ${req.params.id} ${userData} - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `L'utilisateur numéro ${req.params.id} n'a pas pu être mis à jour.`,
            })
    })
}

exports.deleteApiUsersId = (req, res) =>
{
    db.User.destroy({
        where:
        {
            id: req.params.id
        }
    }).then((count) =>
    {
        console.log(`[DEBUG] deleteApiUsersId ${count} row(s) deleted`)

        if(count != '0')
        {
            return res
                .status(httpCodes.OK)
                .json({
                    message: `L'utilisateur numéro ${req.params.id} a été supprimé.`
                })
        }
        else
        {
            return res
                .status(httpCodes.OK)
                .json({
                    message: `L'utilisateur numéro ${req.params.id} n'existe pas ou a déjà été supprimé.`
                })
        }

        
    }).catch((exception) =>
    {
        console.error(`[ERROR] deleteApiUsersId ${req.params.id} - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `L'utilisateur numéro ${req.params.id} n'a pas pu être supprimé.`,
            })
    })
}