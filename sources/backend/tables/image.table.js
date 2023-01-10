const db = require('../postgres')

exports.createWithTransaction = (imageData, transactionInstance) =>
{
    return db.Image
        .create(imageData,
            {
                transaction: transactionInstance
            }
        )
}

exports.updateWithTransaction = (imageData, postId, transactionInstance) =>
{
    return db.Image
        .update(imageData,
            {
                where:
                {
                    [db.Op.and]: [{PostId: postId}, {number: imageData.number}]
                }
            },
            {
                transaction: transactionInstance
            }
        )
}