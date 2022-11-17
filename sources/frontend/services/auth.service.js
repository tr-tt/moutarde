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
            .then((response) =>
            {
                if (response.data.accessToken)
                {
                    localStorage.setItem('user', JSON.stringify(response.data))
                }

                return response.data
            })
    }

    logout()
    {
        localStorage.removeItem('user')
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

    getCurrentUser()
    { 
        return JSON.parse(localStorage.getItem('user'))
    }
}

export default new AuthService()