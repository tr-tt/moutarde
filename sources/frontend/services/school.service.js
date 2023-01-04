import axios from 'axios'

class SchoolService
{
    getApiSchool()
    {
        return axios
            .get('/api/school')
    }

    getApiSchoolByName(name)
    {
        return axios
            .get(`/api/school/${name}`)
    }
}

export default new SchoolService()