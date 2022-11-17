const db = require('../postgres')
const path = require('path')
const config = require(path.resolve('setups', 'auth.config.js'))
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const checkExistUserData = (req) =>
{
    const updateData = {}

    if (req.body.username)
    {
        updateData.username = req.body.username
    }

    if (req.body.email)
    {
        updateData.email = req.body.email
    }

    if (req.body.password)
    {
        updateData.password = bcrypt.hashSync(req.body.password, 8)
    }

    return updateData
}

exports.getApiUsers = (req, res) =>
{
    db.User.findAll().then((users) =>
    {
        return res.status(200).send({
            message: users
        })
    }).catch((exception) =>
    {
        console.error(`[ERROR] getApiUsers - ${exception.message}`)

        return res.status(500).send({
            message: `Impossible d'accéder aux données utilisateur`,
        })
    })
}

exports.getApiUsersId = (req, res) =>
{
    return res.status(200).send({
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

        return res.status(200).send({
            message: `L'utilisateur ${req.body.username} a été enregistré`
        })
    }).catch((exception) =>
    {
        console.error(`[ERROR] postApiUsers ${req.body.username} ${req.body.email} ${req.body.password} - ${exception.message}`)

        return res.status(500).send({
            message: `L'utilisateur ${req.body.username} n'a pas pu être enregistré`,
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
            return res.status(200).send({
                message: `L'utilisateur ${req.params.id} a été mis à jour`
            })
        }
        else
        {
            return res.status(400).send({
                message: `L'utilisateur ${req.params.id} n'a pas été mis à jour`
            })
        }
        
    }).catch((exception) =>
    {
        console.error(`[ERROR] putApiUsersId ${req.params.id} ${userData} - ${exception.message}`)

        return res.status(500).send({
            message: `L'utilisateur ${req.params.id} n'a pas pu être mis à jour`,
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
            return res.status(200).send({
                message: `L'utilisateur numéro ${req.params.id} a été supprimé`
            })
        }
        else
        {
            return res.status(400).send({
                message: `L'utilisateur numéro ${req.params.id} a déjà été supprimé`
            })
        }

        
    }).catch((exception) =>
    {
        console.error(`[ERROR] deleteApiUsersId ${req.params.id} - ${exception.message}`)

        return res.status(500).send({
            message: `L'utilisateur numéro ${req.params.id} n'a pas pu être supprimé`,
        })
    })
}

exports.postApiAuthSignin = (req, res) =>
{
    db.User.findOne({
        where:
        {
            username: req.body.username
        }
    }).then((user) =>
    {
        if (!user)
        {
            console.error(`[ERROR] postApiAuthSignin user ${req.body.username} not found`)

            return res.status(404).send({
                message: `L'utilisateur ${req.body.username} n'a pas été trouvé`,
            })
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        )

        if (!passwordIsValid)
        {
            console.error(`[ERROR] postApiAuthSignin user ${req.body.username} password ${req.body.password} invalid`)

            return res.status(401).send({
                accessToken: null,
                message: 'Le mot de passe est invalide',
            })
        }

        const token = jwt.sign({id: user.id}, config.secret,
        {
            expiresIn: 86400 // 24 hours
        })

        return res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token
        })
    }).catch((exception) =>
    {
        console.error(`[ERROR] postApiAuthSignin user ${req.body.username} password ${req.body.password} - ${exception.message}`)

        return res.status(500).send({
            message: `Impossible de se connceter avec l'utilisateur ${req.body.username}`
        })
    })
}