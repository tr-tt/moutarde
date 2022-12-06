import './users_edit.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_usermenu/MOU_usermenu'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_select/MOU_select'
import UserService from '../../services/user.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _subtitle = document.querySelector('#subtitle')

const _username = document.querySelector('#username')
const _email = document.querySelector('#email')
const _birthday = document.querySelector('#birthday')
const _sex = document.querySelector('#sex')
const _school = document.querySelector('#school')
const _schoolYear = document.querySelector('#school__year')

const _button = document.querySelector('#button')

let _current_username = ''
let _current_email = ''

UserService
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
    })

_button.addEventListener('click', () =>
{
    let username = _username.value
    let email = _email.value
    const birthday = _birthday.value
    const sex = _sex.value
    const school = _school.value
    const schoolYear = _schoolYear.value

    if(!username)
    {
        _subtitle.textContent = `Un nom d'utilisateur unique est requis.`
        _subtitle.classList.add('error')
    }
    else if(!email)
    {
        _subtitle.textContent = `Une addresse email unique est requise.`
        _subtitle.classList.add('error')
    }
    else if(!school)
    {
        _subtitle.textContent = `Un nom d'école est requis.`
        _subtitle.classList.add('error')
    }
    else if(!schoolYear)
    {
        _subtitle.textContent = `Une année de formation comprise entre 2000 et 2023 est requise.`
        _subtitle.classList.add('error')
    }
    else
    {
        username = username === _current_username ? '' : username
        email = email === _current_email ? '' : email

        UserService
            .putApiUser(
                username,
                email,
                birthday,
                sex,
                school,
                schoolYear
            )
            .then((response) =>
            {
                _subtitle.textContent = response.data.message
                _subtitle.classList.remove('error')
            })
            .catch((exception) =>
            {
                _subtitle.textContent = exception.response.data.message
                _subtitle.classList.add('error')
            })
    }
})


