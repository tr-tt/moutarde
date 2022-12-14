import axios from 'axios'

class UserService
{
    getApiUser()
    {
        return axios
            .get('/api/user')
    }

    postApiUser(formData)
    {
        return axios
            .post('/api/user', formData)
    }

    putApiUser(formData)
    {
        return axios
            .put('/api/user', formData)
    }

    postApiUserPasswordForgot(formData)
    {
        return axios
            .post('/api/user/password/forgot', formData)
    }

    postApiUserPasswordReset(formData)
    {
        return axios
            .post(`/api/user${window.location.pathname}`, formData)
    }
}

export default new UserService()