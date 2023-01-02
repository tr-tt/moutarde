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

exports.findAll = () =>
{
    return db.Contact
        .findAll(
            {
                include:
                [
                    {
                        model: db.School,
                        attributes: ['name'],
                        through:
                        {
                            attributes: []
                        }
                    }
                ]
            }
        )
}

exports.findById = (id) =>
{
    return db.Contact
        .findByPk(id,
            {
                include:
                [
                    {
                        model: db.School,
                        attributes: ['name'],
                        through:
                        {
                            attributes: []
                        }
                    }
                ]
            }
        )
}