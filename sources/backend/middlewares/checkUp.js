const db = require('../postgres')

usernameExist = (req, res, next) =>
{
    if(req.body.username)
    {
        next()
    }
    else
    {
        console.error('[ERROR] usernameExist - No username provided')

        return res.status(400).send({
            message: `Le nom d'utilisateur est requis`,
        })
    }
}

emailExist = (req, res, next) =>
{
    if(req.body.email)
    {
        next()
    }
    else
    {
        console.error('[ERROR] emailExist - No email provided')

        return res.status(400).send({
            message: `Une adresse email est requise`,
        })
    }
}

passwordExist = (req, res, next) =>
{
    if(req.body.password)
    {
        next()
    }
    else
    {
        console.error('[ERROR] passwordExist - No password provided')

        return res.status(400).send({
            message: `Un mot de passe est requis`,
        })
    }
}

userIdExist = (req, res, next) =>
{
    if(req.params.id)
    {
        db.User.findOne({
            where:
            {
                id: req.params.id
            }
        }).then((user) =>
        {
            if(user)
            {
                req.user = user

                next()
            }
            else
            {
                console.error(`[ERROR] userIdExist - User id ${req.params.id} not found`)

                return res.status(404).send({
                    message: `L'utilisateur numéro ${req.params.id} n'a pas été trouvé`,
                })
            }
        }).catch((exception) =>
        {
            console.error(`[ERROR] userIdExist ${req.params.id} - ${exception.message}`)

            return res.status(500).send({
                message: `Le numéro ${req.params.id} est invalide`,
            })
        })
    }
    else
    {
        console.error('[ERROR] userIdExist - No user id provided')

        return res.status(400).send({
            message: `Un id d'utilisateur est requis`,
        })
    }
}

usernameDuplicated = (req, res, next) =>
{
    if(req.body.username)
    {
        db.User.findOne({
            where:
            {
                username: req.body.username
            }
        }).then((user) =>
        {
            if (user)
            {
                console.error(`[ERROR] usernameDuplicated - Username ${req.body.username} already taken`)

                return res.status(400).send({
                    message: `Le nom d'utilisateur ${req.body.username} est déjà utilisé`,
                })
            }
            else
            {
                next()
            }
        }).catch((exception) =>
        {
            console.error(`[ERROR] usernameDuplicated ${req.body.username} - ${exception.message}`)

            return res.status(500).send({
                message: `Le nom d'utilisateur ${req.body.username} est invalide`,
            })
        })
    }
    else
    {
        next()
    }
}

emailDuplicated = (req, res, next) =>
{
    if(req.body.email)
    {
        db.User.findOne({
            where:
            {
                email: req.body.email
            }
        }).then((user) =>
        {
            if (user)
            {
                console.error(`[ERROR] emailDuplicated - Email ${req.body.email} already taken`)

                return res.status(400).send({
                    message: `L'adresse email ${req.body.email} est déjà utilisée`
                })
            }
            else
            {
                next()
            }
        }).catch((exception) =>
        {
            console.error(`[ERROR] emailDuplicated ${req.body.email} - ${exception.message}`)

            return res.status(500).send({
                message: `L'adresse email ${req.body.email} est invalide`
            })
        })
    }
    else
    {
        next()
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

                return res.status(404).send({
                    message: `Le formulaire numéro ${req.params.id} n'a pas été trouvé`,
                })
            }
        }).catch((exception) =>
        {
            console.error(`[ERROR] postIdExist ${req.params.id} - ${exception.message}`)

            return res.status(500).send({
                message: `Le numéro ${req.params.id} est invalide`,
            })
        })
    }
    else
    {
        console.error('[ERROR] postIdExist - No post id provided')

        return res.status(400).send({
            message: `Un id de formulaire est requis`,
        })
    }
}

const checkUp =
{
    usernameExist: usernameExist,
    emailExist: emailExist,
    passwordExist: passwordExist,
    userIdExist: userIdExist,
    usernameDuplicated: usernameDuplicated,
    emailDuplicated: emailDuplicated,
    postIdExist: postIdExist
}

module.exports = checkUp