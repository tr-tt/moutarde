const db = require('../postgres')

checkDuplicateUsernameOrEmail = (req, res, next) =>
{
    // Username
    db.Users.findOne({
        where:
        {
            username: req.body.username
        }
    }).then((user) =>
    {
        if (user)
        {
            res.status(400).send({
                message: '[ERROR] Username is already in use.'
            })

            return
        }

        // Email
        db.Users.findOne({
            where:
            {
                email: req.body.email
            }
        }).then((user) =>
        {
            if (user)
            {
                res.status(400).send({
                    message: '[ERROR] Email is already in use.'
                })

                return
            }

            next()
        })
    })
}

const verifySignUp =
{
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
}

module.exports = verifySignUp