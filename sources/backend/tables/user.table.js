const db = require('../postgres')

exports.create = (userData) =>
{
    return db.User
        .create(userData)
}

exports.update = (userData, id) =>
{
    return db.User
        .update(userData,
            {
                where:
                {
                    id: id
                }
            }
        )
}

exports.delete = (id) =>
{
    return db.User
        .destroy(
            {
                where:
                {
                    id: id
                }
            }
        )
}

exports.findByUsername = (username) =>
{
    return db.User
        .findOne(
            {
                where:
                {
                    username: username
                }
            }
        )
}

exports.findByEmail = (email) =>
{
    return db.User
        .findOne(
            {
                where:
                {
                    email: email
                }
            }
        )
}

exports.findByEmailOrUsername = (emailOrUsername) =>
{
    return db.User
        .findOne(
            {
                where:
                {
                    [db.Op.or]: [{email: emailOrUsername}, {username: emailOrUsername}]
                }
            }
        )
}

exports.findById = (id) =>
{
    return db.User
        .findByPk(id)
}