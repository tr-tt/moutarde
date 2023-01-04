const db = require('../postgres')

exports.count = () =>
{
    return db.Contact
        .count()
}

exports.create = (contact, transactionInstance) =>
{
    return db.Contact
        .create(
            {
                name: contact.name,
                job: contact.job,
                email: contact.email
            },
            {
                transaction: transactionInstance
            }
        )
}