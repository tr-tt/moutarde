import axios from 'axios'

class SchoolService
{
    getApiSchool()
    {
        return axios
            .get('/api/school')
    }
}

export default new SchoolService()