const db = require('../postgres')
const path = require('path')
const config = require(path.resolve('setups', 'auth.config.js'))
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.signup = (req, res) =>
{
    db.Users.create({
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
            message: `[ERROR] When registering new user - ${err.message}`
        })
    })
}

exports.signin = (req, res) =>
{
    db.Users.findOne({
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
                message: `[ERROR] User ${req.body.username} not found.`
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
                message: '[ERROR] Invalid password.'
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