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

exports.findByName = (name) =>
{
    return db.School
        .findOne(
            {
                where:
                {
                    name: name
                },
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