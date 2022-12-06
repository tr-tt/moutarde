import './signup.css'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_select/MOU_select'
import UserService from '../../services/user.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _subtitle = document.querySelector('#subtitle')
const _signupFields = document.querySelector('#signup__fields')

const _username = document.querySelector('#username')
const _email = document.querySelector('#email')
const _birthday = document.querySelector('#birthday')
const _sex = document.querySelector('#sex')
const _school = document.querySelector('#school')
const _schoolYear = document.querySelector('#school__year')
const _password = document.querySelector('#password')
const _confirmPassword = document.querySelector('#confirm__password')

const _show = document.querySelector('#show')
const _signin = document.querySelector('#signin')
const _button = document.querySelector('#button')

_show.addEventListener('click', () =>
{
    if(_password.getAttribute('type') === 'password')
    {
        _password.setAttribute('type', 'text')
    }
    else
    {
        _password.setAttribute('type', 'password')
    }
})

_button.addEventListener('click', () =>
{
    const username = _username.value
    const email = _email.value
    const birthday = _birthday.value
    const sex = _sex.value
    const school = _school.value
    const schoolYear = _schoolYear.value
    const password = _password.value
    const confirmPassword = _confirmPassword.value

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
    else if(!password)
    {
        _subtitle.textContent = `Un mot de passe non vide est requis.`
        _subtitle.classList.add('error')
    }
    else if(!confirmPassword)
    {
        _subtitle.textContent = `Le mot de passe de confirmation identique au mot de passe est requis.`
        _subtitle.classList.add('error')
    }
    else if(password !== confirmPassword)
    {
        _subtitle.textContent = `Votre mot de passe est différent du mot de passe de confirmation.`
        _subtitle.classList.add('error')
    }
    else
    {
        UserService
            .postApiUser(
                username,
                email,
                birthday,
                sex,
                school,
                schoolYear,
                password,
                confirmPassword
            )
            .then(() =>
            {
                _subtitle.textContent = `Votre compte a été crée, vous pouvez dès à présent vous connecter.`
                _subtitle.classList.remove('error')

                _signupFields.innerHTML = ''
                _button.style.display = 'none'
                _signin.setAttribute('css', 'colored')
            })
            .catch((exception) =>
            {
                _subtitle.textContent = exception.response.data.message
                _subtitle.classList.add('error')
            })
    }
})