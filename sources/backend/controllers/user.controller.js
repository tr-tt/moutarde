const db = require('../postgres')
const httpCodes = require('../httpCodes')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.getApiUser = (req, res) =>
{
    if(req.user_id)
    {
        db.User.findOne({
            where:
            {
                id: req.user_id
            }
        }).then((user) =>
        {
            if(user)
            {
                return res
                    .status(httpCodes.OK)
                    .json({
                        message: 
                        {
                            username: user.username,
                            email: user.email
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
        }).catch((exception) =>
        {
            console.error(`[ERROR] getApiUser ${req.user_id} - ${exception.message}`)
    
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Le numéro ${req.user_id} est invalide.`,
                })
        })
    }
    else
    {
        console.error(`[ERROR] getApiUser no user id provided.`)
    
        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un numéro d'utilisateur est requis.`,
            })
    }
    
}

exports.postApiUser = (req, res) =>
{
    db.User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    }).then((user) =>
    {
        console.log('[DEBUG] postApiUser new user created')
        console.log(user)

        return res
            .status(httpCodes.OK)
            .json({
                message: `L'utilisateur ${req.body.username} a été enregistré.`
            })
    }).catch((exception) =>
    {
        console.error(`[ERROR] postApiUser ${req.body.username} ${req.body.email} ${req.body.password} - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `L'utilisateur ${req.body.username} n'a pas pu être enregistré.`,
            })
    })
}

exports.putApiUser = (req, res) =>
{
    const userData = {}

    req.body.username ? userData.username = req.body.username : ''
    req.body.email ? userData.email = req.body.email : ''

    if(req.user_id)
    {
        db.User.update(userData,
        {
            where:
            {
                id: req.user_id
            }
        }).then((count) =>
        {
            console.log(`[DEBUG] putApiUser ${count} row(s) updated`)
    
            if(count != '0')
            {
                return res
                    .status(httpCodes.OK)
                    .json({
                        message: `Votre profil a été mis à jour.`
                    })
            }
            else
            {
                return res
                    .status(httpCodes.OK)
                    .json({
                        message: `Votre profil est déjà à jour.`
                    })
            }
            
        }).catch((exception) =>
        {
            console.error(`[ERROR] putApiUser ${req.user_id} ${userData} - ${exception.message}`)
    
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `L'utilisateur numéro ${req.user_id} n'a pas pu être mis à jour.`,
                })
        })
    }
    else
    {
        console.error(`[ERROR] putApiUser no user id provided.`)
    
        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un numéro d'utilisateur est requis.`,
            })
    }
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
    const link = `http://127.0.0.1:8000/password/reset/${req.user.id}/${token}`

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
    db.User.update({
        password: bcrypt.hashSync(req.body.password, 8)
    },
    {
        where:
        {
            id: req.user_id
        }
    }).then((count) =>
    {
        console.log(`[DEBUG] postApiUserPasswordReset ${count} row(s) updated`)

        if(count != '0')
        {
            return res
                .status(httpCodes.OK)
                .json({
                    message: `Votre mot de passe à été mis à jour.`
                })
        }
        else
        {
            return res
                .status(httpCodes.OK)
                .json({
                    message: `Votre mot de passe est déjà à jour.`
                })
        }
        
    }).catch((exception) =>
    {
        console.error(`[ERROR] postApiUserPasswordReset ${req.user_id} - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `Le mot de passe de l'utilisateur numéro ${req.user_id} n'a pas pu être mis à jour.`,
            })
    })
}

/*const checkExistUserData = (req) =>
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
}*/

//===============================================//
// OTHER api for USERS
//===============================================//

