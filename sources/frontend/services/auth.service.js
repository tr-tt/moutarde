import axios from 'axios'

class AuthService
{
    getApiAuthSignin()
    {
        return axios
            .get('/api/auth/signin')
    }

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