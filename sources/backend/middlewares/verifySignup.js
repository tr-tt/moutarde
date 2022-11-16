const db = require('../postgres')

checkDuplicateUsernameOrEmail = (req, res, next) =>
{
    // Username
    db.User.findOne({
        where:
        {
            username: req.body.username
        }
    }).then((user) =>
    {
        if (user)
        {
            return res.status(400).send({
                message: '[ERROR] Username is already in use.',
                code: 3
            })
        }

        // Email
        db.User.findOne({
            where:
            {
                email: req.body.email
            }
        }).then((user) =>
        {
            if (user)
            {
                return res.status(400).send({
                    message: '[ERROR] Email is already in use.',
                    code: 4
                })
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