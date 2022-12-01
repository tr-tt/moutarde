const db = require('../postgres')
const httpCodes = require('../httpCodes')

/*
const checkExistPostData = (req) =>
{
    const updateData = {}

    if(req.body.text)
    {
        updateData.text = req.body.text
    }

    return updateData
}

//===============================================//
// REST api for POSTS
//===============================================//

exports.getApiPosts = (req, res) =>
{
    db.Post.findAll().then((posts) =>
    {
        return res
            .status(httpCodes.OK)
            .json({
                message: posts
            })
    }).catch((exception) =>
    {
        console.error(`[ERROR] getApiPosts - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `Impossible d'accéder aux données des formulaires.`,
            })
    })
}

exports.getApiPostsId = (req, res) =>
{
    return res
        .status(httpCodes.OK)
        .json({
            message: req.post
        })
}

exports.postApiPosts = (req, res) =>
{
    db.Post.create({
        user_id: req.user_id,
        text: req.body.text
    }).then((post) =>
    {
        console.log('[DEBUG] postApiPosts new user created')
        console.log(post)

        return res
            .status(httpCodes.OK)
            .json({
            message: `Le formulaire de l'utilisateur numéro ${req.user_id} a été enregistré.`
            })
    }).catch((exception) =>
    {
        console.error(`[ERROR] postApiPosts ${req.user_id} - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `Le formulaire de l'utilisateur numéro ${req.user_id} n'a pas pu être enregistré.`,
            })
    })
}

exports.putApiPostsId = (req, res) =>
{
    const postData = checkExistPostData(req)

    db.Post.update(postData,
    {
        where:
        {
            id: req.params.id
        }
    }).then((count) =>
    {
        console.log(`[DEBUG] putApiPostsId ${count} row(s) updated`)

        if(count != '0')
        {
            return res
                .status(httpCodes.OK)
                .json({
                    message: `Le formulaire numéro ${req.params.id} a été mis à jour.`
                })
        }
        else
        {
            return res
                .status(httpCodes.OK)
                .json({
                    message: `Le formulaire numéro ${req.params.id} est déjà à jour.`
                })
        }
    }).catch((exception) =>
    {
        console.error(`[ERROR] putApiPostsId ${req.params.id} ${postData} - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `Le formulaire numéro ${req.params.id} n'a pas pu être mis à jour.`,
            })
    })
}

exports.deleteApiPostsId = (req, res) =>
{
    db.Post.destroy({
        where:
        {
            id: req.params.id
        }
    }).then((count) =>
    {
        console.log(`[DEBUG] deleteApiPostsId ${count} row(s) deleted`)

        if(count != '0')
        {
            return res
                .status(httpCodes.OK)
                .json({
                    message: `Le formulaire numéro ${req.params.id} a été supprimé.`
                })
        }
        else
        {
            return res
                .status(httpCodes.OK)
                .json({
                    message: `Le formulaire numéro ${req.params.id} n'existe pas ou a déjà été supprimé`
                })
        }

        
    }).catch((exception) =>
    {
        console.error(`[ERROR] deleteApiPostsId ${req.params.id} - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `Le formulaire numéro ${req.params.id} n'a pas pu être supprimé.`,
            })
    })
}

//===============================================//
// Other api for POSTS
//===============================================//

exports.getApiAuthPosts = (req, res) =>
{
    db.Post.findAll({
        where:
        {
            user_id: req.user_id
        }
    }).then((posts) =>
    {
        return res
            .status(httpCodes.OK)
            .json({
                message: posts
            })
    }).catch((exception) =>
    {
        console.error(`[ERROR] getApiAuthPosts ${req.user_id} - ${exception.message}`)

        return res
            .status(httpCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: `Impossible d'accéder aux données des formulaires pour l'utilisateur numéro ${req.user_id}.`,
            })
    })
}
*/