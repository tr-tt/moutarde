import './password_reset.css'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_headerbar/MOU_headerbar'
import UserService from '../../services/user.service'
import AuthService from '../../services/auth.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _subtitle = document.querySelector('#subtitle')
const _form = document.querySelector('form')
const _password = document.querySelector('#password')
const _confirmPassword = document.querySelector('#confirm__password')
const _show = document.querySelector('#show')
const _redirect = document.querySelector('#redirect')
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

    const password = _password.value
    const confirmPassword = _confirmPassword.value

    if(password)
    {
        formData.append('password', password)
    }
    else
    {
        _subtitle.textContent = `Un mot de passe non vide est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(confirmPassword)
    {
        formData.append('confirmPassword', confirmPassword)
    }
    else
    {
        _subtitle.textContent = `Le mot de passe de confirmation est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(password !== confirmPassword)
    {
        _subtitle.textContent = `Votre mot de passe est différent du mot de passe de confirmation.`
        _subtitle.classList.add('error')

        return
    }

    UserService
        .postApiUserPasswordReset(formData)
        .then((response) =>
        {
            _subtitle.textContent = response.data.message
            _subtitle.classList.remove('error')

            AuthService
                .getApiAuthSignout()

            _form.style.display = 'none'
            _button.style.display = 'none'
            _redirect.setAttribute('label', 'Se connecter')
            _redirect.setAttribute('css', 'colored')
        })
        .catch((exception) =>
        {
            _subtitle.textContent = exception.response.data.message
            _subtitle.classList.add('error')
        })
})