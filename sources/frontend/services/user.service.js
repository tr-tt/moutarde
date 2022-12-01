import axios from 'axios'

class UserService
{
    getApiUser()
    {
        return axios
            .get('/api/user')
    }

    postApiUser(username, email, password)
    {
        return axios
            .post('/api/user',
            {
                username,
                email,
                password
            })
    }

    putApiUser(username, email)
    {
        return axios
            .put('/api/user',
            {
                username,
                email
            })
    }

    postApiUserPasswordForgot(emailOrUsername)
    {
        return axios
            .post('/api/user/password/forgot',
            {
                emailOrUsername
            })
    }

    postApiUserPasswordReset(password, confirmPassword)
    {
        return axios
            .post(`/api/user${window.location.pathname}`,
            {
                password,
                confirmPassword
            })
    }
}

export default new UserService()