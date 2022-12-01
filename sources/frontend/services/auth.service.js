import axios from 'axios'

class AuthService
{
    postApiAuthSignin(username, password)
    {
        return axios
            .post('/api/auth/signin',
            {
                username,
                password
            })
    }

    getApiAuthSignout()
    {
        console.log('disconnect');
        return axios
            .get('/api/auth/signout')
    }
}

export default new AuthService()