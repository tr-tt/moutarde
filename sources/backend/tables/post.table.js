const db = require('../postgres')

exports.createWithTransaction = (postData, transactionInstance) =>
{
    return db.Post
        .create(
            postData,
            {
                transaction: transactionInstance
            }
        )
}

exports.updateWithTransaction = (postData, postId, transactionInstance) =>
{
    return db.Post
        .update(
            postData,
            {
                where:
                {
                    id: postId
                }
            },
            {
                transaction: transactionInstance
            }
        )
}

exports.delete = (id) =>
{
    return db.Post
        .destroy(
            {
                where:
                {
                    id: id
                }
            }
        )
}

exports.findById = (id) =>
{
    return db.Post
        .findByPk(
            id,
            {
                include:
                [
                    {
                        model: db.Image,
                        attributes: ['name', 'type', 'blob']
                    }
                ]
            }
        )
}

exports.findAllByUserId = (UserId) =>
{
    return db.Post
        .findAll(
            {
                where:
                {
                    UserId: UserId
                },
                include:
                [
                    {
                        model: db.Image,
                        attributes: ['name', 'type', 'blob']
                    }
                ],
                order:
                [
                    ['id', 'ASC']
                ]
            }
        )
}