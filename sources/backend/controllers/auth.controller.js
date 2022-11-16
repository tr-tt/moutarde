const db = require('../postgres')
const path = require('path')
const config = require(path.resolve('setups', 'auth.config.js'))
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.signinPage = (req, res) =>
{
    res.sendFile(path.resolve('_build', 'signin.html'))
}

exports.signupPage = (req, res) =>
{
    res.sendFile(path.resolve('_build', 'signup.html'))
}

exports.signup = (req, res) =>
{
    db.Userscreate({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
    .then((user) =>
    {
        res.send({
            message: '[INFO] User was registered successfully.'
        })
    })
    .catch((err) =>
    {
        res.status(500).send({
            message: `[ERROR] When registering new user - ${err.message}`,
            code: 5
        })
    })
}

exports.signin = (req, res) =>
{
    db.User.findOne({
        where:
        {
            username: req.body.username
        }
    })
    .then((user) =>
    {
        if (!user)
        {
            return res.status(404).send({
                message: `[ERROR] User ${req.body.username} not found.`,
                code: 1
            })
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        )

        if (!passwordIsValid)
        {
            return res.status(401).send({
                accessToken: null,
                message: '[ERROR] Invalid password.',
                code: 2
            })
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        })

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token
        })
    })
    .catch((err) =>
    {
        res.status(500).send({
            message: `[ERROR] When login - ${err.message}`
        })
    })
}