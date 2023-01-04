const httpCodes = require('../httpCodes')
const logger = require('../logger')
const SchoolTable = require('../tables/school.table.js')

schoolNameExist = (req, res, next) =>
{
    if(!req.params.name)
    {
        logger.warn(`no school name provided`, {file: 'school.middleware.js', function: 'schoolNameExist', http: httpCodes.BAD_REQUEST})

        return res
            .status(httpCodes.BAD_REQUEST)
            .json({
                message: `Un nom d'établissement scolaire est requis.`,
            })
    }

    SchoolTable
        .findByName(req.params.name)
        .then((school) =>
        {
            if(school)
            {
                req.school = school

                logger.debug(`school found ${JSON.stringify(school, null, 2)}`, {file: 'school.middleware.js', function: 'schoolNameExist', http: httpCodes.OK})

                return next()
            }
            else
            {
                logger.warn(`school name ${req.params.name} not found`, {file: 'school.middleware.js', function: 'schoolNameExist', http: httpCodes.NOT_FOUND})

                return res
                    .status(httpCodes.NOT_FOUND)
                    .json({
                        message: `L'établissement scolaire n'a pas été trouvé.`,
                    })
            }
        })
        .catch((exception) =>
        {
            logger.error(`Error when retrieving one school with name ${req.params.name} exception ${exception}`, {file: 'school.controller.js', function: 'getApiSchoolByName', http: httpCodes.INTERNAL_SERVER_ERROR})

            return res
                .status(httpCodes.INTERNAL_SERVER_ERROR)
                .json({
                    message: `Une erreur est survenue lors de la recherches de l'établissement scolaire.`
                })
        })
}

const schoolMiddleware =
{
    schoolNameExist
}

module.exports = schoolMiddleware