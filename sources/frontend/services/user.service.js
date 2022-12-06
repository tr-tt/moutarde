import axios from 'axios'

class UserService
{
    getApiUser()
    {
        return axios
            .get('/api/user')
    }

    postApiUser(
        username,
        email,
        birthday,
        sex,
        school,
        schoolYear,
        password,
        confirmPassword
    )
    {
        return axios
            .post('/api/user',
            {
                username,
                email,
                birthday,
                sex,
                school,
                schoolYear,
                password,
                confirmPassword
            })
    }

    putApiUser(
        username,
        email,
        birthday,
        sex,
        school,
        schoolYear
    )
    {
        return axios
            .put('/api/user',
            {
                username,
                email,
                birthday,
                sex,
                school,
                schoolYear
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