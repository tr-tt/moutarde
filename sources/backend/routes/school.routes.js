const controller = require('../controllers/school.controller')

module.exports = (app) =>
{
    app.get(
        '/api/school',
        controller.getApiSchool
    )
}