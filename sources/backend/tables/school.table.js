const db = require('../postgres')

exports.count = () =>
{
    return db.School
        .count()
}

exports.create = (school, transactionInstance) =>
{
    return db.School
        .create(
            {
                name: school.name
            },
            {
                transaction: transactionInstance
            }
        )
}

exports.findAll = () =>
{
    return db.School
        .findAll(
            {
                include:
                [
                    {
                        model: db.Contact,
                        attributes: ['name', 'job', 'email'],
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
    return db.School
        .findByPk(id,
            {
                include:
                [
                    {
                        model: db.Contact,
                        attributes: ['name', 'job', 'email'],
                        through:
                        {
                            attributes: []
                        }
                    }
                ]
            }
        )
}
