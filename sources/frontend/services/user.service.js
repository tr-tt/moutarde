import axios from 'axios'
import authHeader from './auth.header'

const API_URL = `${window.location.href}/api/data/`

class UserService
{
    getBoard()
    {
        return axios
            .get('board',
            {
                headers: authHeader()
            })
    }
}

export default new UserService()