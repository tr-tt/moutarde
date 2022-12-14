const db = require('../postgres')
const httpCodes = require('../httpCodes')

titleExist = (req, res, next) =>
{
    if(req.body.title)
    {
        return next()
    }
    else
    {
        console.error('[ERROR] titleExist - No title provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Le titre du formulaire est requis.`,
            })
    }
}

toolExist = (req, res, next) =>
{
    if(req.body.tool)
    {
        return next()
    }
    else
    {
        console.error('[ERROR] toolExist - No tool provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `L' outil cible est requis.`,
            })
    }
}

postIdExist = (req, res, next) =>
{   
    if(!req.params.id)
    {
        console.error('[ERROR] postIdExist - No post id provided')

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un id de formulaire est requis.`,
            })
    }

    db.Post
        .findByPk(req.params.id)
        .then((post) =>
        {
            if(post)
            {
                req.post = post

                return next()
            }
            else
            {
                console.error(`[ERROR] postIdExist - Post id ${req.params.id} not found`)

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `Le formulaire n'a pas été trouvé.`,
                    })
            }
        })
        .catch((exception) =>
        {
            console.error(`[ERROR] postIdExist ${req.params.id} - ${exception.message}`)

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherche du formulaire`,
                })
        })
}

const postMiddleware =
{
    titleExist,
    toolExist,
    postIdExist
}

module.exports = postMiddleware