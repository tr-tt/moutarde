const httpCodes = require('../httpCodes')
const path = require('path')

exports.getIndex = (req, res) =>
{
    return res
        .sendFile(path.resolve('_build', 'index.html'))
}

exports.getSignin = (req, res) =>
{
    return res
        .sendFile(path.resolve('_build', 'signin.html'))
}

exports.getSignup = (req, res) =>
{
    return res
        .sendFile(path.resolve('_build', 'signup.html'))
}

exports.getUsersEdit = (req, res) =>
{
    switch(req.status)
    {
        case httpCodes.OK:
            return res
                .sendFile(path.resolve('_build', 'users_edit.html'))            
        default:
            return res
                .redirect('/signin')
    }
}

exports.getPosts = (req, res) =>
{
    switch(req.status)
    {
        case httpCodes.OK:
            return res
                .sendFile(path.resolve('_build', 'posts.html'))            
        default:
            return res
                .redirect('/signin')
    }
}

exports.getPostsNew = (req, res) =>
{
    switch(req.status)
    {
        case httpCodes.OK:
            return res
                .sendFile(path.resolve('_build', 'posts_new.html'))            
        default:
            return res
                .redirect('/posts')
    }
}

exports.getPostsEdit = (req, res) =>
{
    switch(req.status)
    {
        case httpCodes.OK:
            return res
                .sendFile(path.resolve('_build', 'posts_edit.html'))            
        default:
            return res
                .redirect('/posts')
    }
}

exports.getPasswordForgot = (req, res) =>
{
    return res
        .sendFile(path.resolve('_build', 'password_forgot.html'))
}

exports.getPasswordReset = (req, res) =>
{
    switch(req.status)
    {
        case httpCodes.OK:
            return res
                .sendFile(path.resolve('_build', 'password_reset.html'))
        default:
            return res
                .redirect('/')
    }
}

exports.getContact = (req, res) =>
{
    switch(req.status)
    {
        case httpCodes.OK:
            return res
                .sendFile(path.resolve('_build', 'contact.html'))            
        default:
            return res
                .redirect('/signin')
    }
}