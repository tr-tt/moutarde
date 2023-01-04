const {authMiddleware, schoolMiddleware} = require('../middlewares')
const controller = require('../controllers/school.controller')

module.exports = (app) =>
{
    app.get(
        '/api/school',
        controller.getApiSchool
    )

    app.get(
        '/api/school/:name',
        [
            authMiddleware.tokenExistVerify,
            authMiddleware.rejectIfBadToken,
            schoolMiddleware.schoolNameExist
        ],
        controller.getApiSchoolByName
    )
}