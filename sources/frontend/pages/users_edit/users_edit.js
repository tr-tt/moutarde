import './users_edit.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_select/MOU_select'
import userService from '../../services/user.service'
import authService from '../../services/auth.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')

const _logout = document.querySelector('#logout')

const _subtitle = document.querySelector('#subtitle')
const _profileFields = document.querySelector('#profile__fields')

const _username = document.querySelector('#username')
const _email = document.querySelector('#email')
const _birthday = document.querySelector('#birthday')
const _sex = document.querySelector('#sex')
const _school = document.querySelector('#school')
const _schoolYear = document.querySelector('#school__year')

const _posts = document.querySelector('#posts')
const _button = document.querySelector('#button')

let _current_username = ''
let _current_email = ''

_logout.addEventListener('click', () =>
{
    authService
        .getApiAuthSignout()
        .then(() =>
        {
            window.location.href = '/'
        })
        .catch((exception) =>
        {
            console.error(exception)
        })
})

userService
    .getApiUser()
    .then((response) =>
    {
        _current_username = response.data.message.username || ''
        _current_email = response.data.message.email || ''

        _username.value = _current_username
        _email.value = _current_email
        _birthday.value = response.data.message.birthday || ''
        _sex.value = response.data.message.sex || ''
        _school.value = response.data.message.school || ''
        _schoolYear.value = response.data.message.schoolYear || ''

        _loading.style.display = 'none'
    })
    .catch((exception) =>
    {
        console.error(exception)
    })

_button.addEventListener('click', () =>
{
    const formData = new FormData()

    let username = _username.value
    let email = _email.value
    const birthday = _birthday.value
    const sex = _sex.value
    const school = _school.value
    const schoolYear = _schoolYear.value

    if(username)
    {
        if(username !== _current_username)
        {
            formData.append('username', username)
        }        
    }
    else
    {
        _subtitle.textContent = `Un nom d'utilisateur unique est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(email)
    {
        if(email !== _current_email)
        {
            formData.append('email', email)
        }
    }
    else
    {
        _subtitle.textContent = `Une addresse email unique est requise.`
        _subtitle.classList.add('error')

        return
    }

    if(birthday)
    {
        formData.append('birthday', birthday)
    }

    if(sex)
    {
        formData.append('sex', sex)
    }

    if(school)
    {
        formData.append('school', school)
    }
    else
    {
        _subtitle.textContent = `Un nom d'école est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(schoolYear)
    {
        formData.append('schoolYear', schoolYear)
    }
    else
    {
        _subtitle.textContent = `Une année de formation comprise entre 2000 et 2023 est requise.`
        _subtitle.classList.add('error')

        return
    }

    userService
        .putApiUser(formData)
        .then((response) =>
        {
            _subtitle.textContent = response.data.message
            _subtitle.classList.remove('error')

            _profileFields.innerHTML = ''
            _button.style.display = 'none'
            _posts.setAttribute('label', 'Mes formulaires')
            _posts.setAttribute('css', 'colored')
        })
        .catch((exception) =>
        {
            if(exception.response
                && exception.response.data
                && exception.response.data.message)
            {
                _subtitle.textContent = exception.response.data.message
                _subtitle.classList.add('error')
            }
            else
            {
                console.error(exception)
            }
        })
})


