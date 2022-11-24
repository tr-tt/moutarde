const db = require('../postgres')
const httpCodes = require('../httpCodes')

textExist = (req, res, next) =>
{
    if(req.body.text)
    {
        next()
    }
    else
    {
        console.error('[ERROR] textExist - No text provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Le texte est requis.`,
            })
    }
}

postIdExist = (req, res, next) =>
{
    if(req.params.id)
    {
        db.Post.findOne({
            where:
            {
                id: req.params.id
            }
        }).then((post) =>
        {
            if(post)
            {
                req.post = post

                next()
            }
            else
            {
                console.error(`[ERROR] postIdExist - Post id ${req.params.id} not found`)

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `Le formulaire numéro ${req.params.id} n'a pas été trouvé.`,
                    })
            }
        }).catch((exception) =>
        {
            console.error(`[ERROR] postIdExist ${req.params.id} - ${exception.message}`)

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Le numéro ${req.params.id} est invalide.`,
                })
        })
    }
    else
    {
        console.error('[ERROR] postIdExist - No post id provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un id de formulaire est requis.`,
            })
    }
}

const postMiddleware =
{
    textExist,
    postIdExist
}

module.exports = postMiddleware