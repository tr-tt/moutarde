import axios from 'axios'

class AuthService
{
    postApiAuthSignin(username, password)
    {
        return axios
            .post('api/auth/signin',
            {
                username,
                password
            })
    }

    getApiAuthSignout()
    {
        return axios
            .get('api/auth/signout')
    }

    postApiUsers(username, email, password)
    {
        return axios
            .post('api/users',
            {
                username,
                email,
                password
            })
    }
}

export default new AuthService()