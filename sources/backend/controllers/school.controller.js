const SchoolTable = require('../tables/school.table')
const logger = require('../logger')
const httpCodes = require('../httpCodes')

exports.getApiSchool = (req, res) =>
{
    SchoolTable
        .findAll()
        .then(
            (schools) =>
            {
                return res
                    .status(httpCodes.OK)
                    .json(
                        {
                            message: schools
                        }
                    )
            }
        )
        .catch(
            (exception) =>
            {
                logger.error(`Error when retrieving schools ${exception}`, {file: 'school.controller.js', function: 'getApiSchool', http: httpCodes.INTERNAL_SERVER_ERROR})

                return res
                    .status(httpCodes.INTERNAL_SERVER_ERROR)
                    .json(
                        {
                            message: `Une erreur est survenue lors de la recherches des noms d'écoles.`
                        }
                    )
            }
        )
}

exports.getApiSchoolByName = (req, res) =>
{
    return res
        .status(httpCodes.OK)
        .json(
            {
                message: req.school
            }
        )
}