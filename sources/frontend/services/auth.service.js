import axios from 'axios'

class AuthService
{
    postApiAuthSignin(formData)
    {
        return axios
            .post('/api/auth/signin', formData)
    }

    getApiAuthSignout()
    {
        return axios
            .get('/api/auth/signout')
    }
}

export default new AuthService()