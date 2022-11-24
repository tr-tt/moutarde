const httpCodes = require('../httpCodes')
const path = require('path')

//===============================================//
// Availables web pages
//===============================================//

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

exports.getBoard = (req, res) =>
{
    switch(req.status)
    {
        case httpCodes.OK:
            return res
                .sendFile(path.resolve('_build', 'board.html'))            
        default:
            return res
                .sendFile(path.resolve('_build', 'signin.html'))
    }
}