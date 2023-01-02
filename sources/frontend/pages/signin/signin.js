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
const _emailOrUsername = document.querySelector('#email_or_username')
const _password = document.querySelector('#password')
const _show = document.querySelector('#show')
const _button = document.querySelector('#button')
const _loading = document.querySelector('#loading')

/*===============================================//
// Hides or shows the password when the _show
// checkbox is triggered
//===============================================*/

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

/*===============================================//
// Tries to submit the form when the _button is
// clicked
//===============================================*/

_button.addEventListener('click', () =>
{
    const formData = new FormData()

    const emailOrUsername = _emailOrUsername.value
    const password = _password.value

    if(emailOrUsername)
    {
        formData.append('emailOrUsername', emailOrUsername)
    }
    else
    {
        _subtitle.textContent = `Le champ "Addresse email ou nom d'utilisateur" est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(password)
    {
        formData.append('password', password)
    }
    else
    {
        _subtitle.textContent = `Le champ "Mot de passe" est requis.`
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

/*===============================================//
// Removes the loading screen when everything
// is loaded
//===============================================*/

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})