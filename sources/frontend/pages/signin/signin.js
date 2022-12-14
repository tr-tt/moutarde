import './signin.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import AuthService from '../../services/auth.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _subtitle = document.querySelector('#subtitle')
const _username = document.querySelector('#username')
const _password = document.querySelector('#password')
const _show = document.querySelector('#show')
const _button = document.querySelector('#button')

const _loading = document.querySelector('#loading')

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})

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
    const formData = new FormData()

    const username = _username.value
    const password = _password.value

    if(username)
    {
        formData.append('username', username)
    }
    else
    {
        _subtitle.textContent = `Votre nom d'utilisateur est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(password)
    {
        formData.append('password', password)
    }
    else
    {
        _subtitle.textContent = `Votre mot de passe est requis.`
        _subtitle.classList.add('error')

        return
    }

    AuthService
        .postApiAuthSignin(formData)
        .then(() =>
        {
            window.location.href = '/posts'
        })
        .catch((exception) =>
        {
            _subtitle.textContent = exception.response.data.message
            _subtitle.classList.add('error')
        })
})