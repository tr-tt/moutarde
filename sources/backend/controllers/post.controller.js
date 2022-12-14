const db = require('../postgres')
const httpCodes = require('../httpCodes')

exports.getApiPost = (req, res) =>
{
    db.User
        .findByPk(req.user_id, {include: [db.Post]})
        .then((user) =>
        {
            if(user)
            {
                const posts = user.Posts

                console.log(`[DEBUG] getApiPost - Posts found ${JSON.stringify(posts)}`)

                posts.forEach((post) =>
                {
                    post.dataValues.UserId && delete post.dataValues.UserId
                    post.dataValues.updatedAt && delete post.dataValues.updatedAt
                })

                return res
                    .status(httpCodes.OK)
                    .json({
                        message: posts
                    })
            }
            else
            {
                console.error(`[ERROR] getApiPost - User id ${req.user_id} not found`)

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `Les formulaires de l'utilisateur numéro ${req.user_id} n'ont pas été trouvés.`,
                    })
            }
        })
        .catch((exception) =>
        {
            console.error(`[ERROR] getApiPost ${req.user_id} - ${exception.message}`)
    
            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche des formulaires.`,
                })
        })
}

exports.postApiPost = (req, res) =>
{
    const postData = {}

    postData.UserId = req.user_id
    postData.title = req.body.title
    postData.tool = req.body.tool
    postData.image = req.files && req.files.image ? req.files.image.data : null

    db.sequelize
        .transaction((transaction) =>
        {
             return db.Post
                .create(postData,
                {
                    transaction: transaction
                })
        })
        .then((post) =>
        {
            console.log(`[DEBUG] postApiPost new post created ${JSON.stringify(post)}`)

            return res
                .status(httpCodes.OK)
                .json({
                    message: `Le formulaire a été enregistré.`
                })
        })
        .catch((exception) =>
        {
            console.error(`[ERROR] postApiPost ${req.user_id} ${req.body.title} - ${exception.message}`)

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de l'enregistrement du formulaire.`,
                })
        })
}

exports.getApiPostId = (req, res) =>
{
    return res
        .status(httpCodes.OK)
        .json({
            message: req.post
        })
}

exports.deleteApiPostId = (req, res) =>
{
    db.sequelize
        .transaction((transaction) =>
        {
            return db.Post
                .destroy({
                    where:
                    {
                        id: req.params.id
                    }
                },
                {
                    transaction: transaction
                })
        })
        .then((count) =>
        {
            console.log(`[DEBUG] deleteApiPostId ${count} row(s) deleted`)

            return res
                .status(httpCodes.OK)
                .json({
                    message: `Le formulaire a été supprimé.`
                })
        })
        .catch((exception) =>
        {
            console.error(`[ERROR] deleteApiPostId ${req.params.id} - ${exception.message}`)

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la suppression d'un formulaire.`,
                })
        })
}

exports.putApiPostId = (req, res) =>
{
    const postData = {}

    req.body.title ? postData.title = req.body.title : ''
    req.body.tool ? postData.tool = req.body.tool : ''
    postData.image = req.files && req.files.image ? req.files.image.data : null

    db.sequelize
        .transaction((transaction) =>
        {
            return db.Post
                .update(postData,
                {
                    where:
                    {
                        id: req.params.id
                    }
                },
                {
                    transaction: transaction
                })
        })
        .then((count) =>
        {
            console.log(`[DEBUG] putApiPostId ${count} row(s) updated`)

            return res
                    .status(httpCodes.OK)
                    .json({
                        message: `Votre formulaire a été mis à jour.`
                    })
        })
        .catch((exception) =>
        {
            console.error(`[ERROR] putApiPostId ${req.params.id} ${JSON.stringify(postData)} - ${exception.message}`)

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la mise à jour du formulaire.`,
                })
        })
}