const db = require('../postgres')
const path = require('path')

exports.getApiPosts = (req, res) =>
{
    db.Post.findAll().then((posts) =>
    {
        return res.status(200).send({
            message: posts
        })
    }).catch((exception) =>
    {
        console.error(`[ERROR] getApiPosts - ${exception.message}`)

        return res.status(500).send({
            message: `Impossible d'accéder aux données des formulaires`,
        })
    })
}

exports.getApiPostId = (req, res) =>
{
    return res.status(200).send({
        message: req.post
    })
}

exports.getIndex = (req, res) =>
{
    return res.sendFile(path.resolve('_build', 'index.html'))
}

exports.getSignin = (req, res) =>
{
    return res.sendFile(path.resolve('_build', 'signin.html'))
}

exports.getSignup = (req, res) =>
{
    return res.sendFile(path.resolve('_build', 'signup.html'))
}

exports.getBoard = (req, res) =>
{
    res.sendFile(path.resolve('_build', 'board.html'))
}