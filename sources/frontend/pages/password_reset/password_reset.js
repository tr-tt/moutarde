import './password_reset.css'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import UserService from '../../services/user.service'

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
    const password = _password.value
    const confirmPassword = _confirmPassword.value

    if(!password)
    {
        _subtitle.textContent = `Un mot de passe non vide est requis.`
        _subtitle.classList.add('error')
    }
    else if(!confirmPassword)
    {
        _subtitle.textContent = `Le mot de passe de confirmation est requis.`
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
            .postApiUserPasswordReset(password, confirmPassword)
            .then((response) =>
            {
                _subtitle.textContent = response.data.message
                _subtitle.classList.remove('error')

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
    }
})