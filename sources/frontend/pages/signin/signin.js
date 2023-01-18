import './signin.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_input_inline/MOU_input_inline'
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

let _keyReady = true
let _buttonReady = true

/*===============================================//
// Hides or shows the password when the _show
// checkbox is triggered
//===============================================*/

_show.addEventListener(
    'click',
    () =>
    {
        if(_password.getAttribute('type') === 'password')
        {
            _password.setAttribute('type', 'text')
        }
        else
        {
            _password.setAttribute('type', 'password')
        }
    }
)

/*===============================================//
// Tries to submit the form when the _button is
// clicked or Enter pressed
//===============================================*/

const error = (message) =>
{
    _subtitle.textContent = message
    _subtitle.classList.add('error')

    _button.setAttribute('css', 'error')
    _buttonReady = true
    _keyReady = true
    
    window.scrollTo(0, 0)
}

const buildFormAndSend = () =>
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
        return error(`Le champ "Addresse email ou nom d'utilisateur" est requis.`)
    }

    if(password)
    {
        formData.append('password', password)
    }
    else
    {
        return error(`Le champ "Mot de passe" est requis.`)
    }

    AuthService
        .postApiAuthSignin(formData)
        .then(
            () =>
            {
                window.location.href = '/posts'
            }
        )
        .catch(
            (exception) =>
            {
                if(exception.response
                    && exception.response.data
                    && exception.response.data.message)
                {
                    error(exception.response.data.message)
                }
                else
                {
                    console.error(exception)

                    error(`Une erreur est survenue.`)
                }
            }
        )
}

_button.addEventListener(
    'click',
    () =>
    {
        if(_buttonReady)
        {
            _buttonReady = false

            buildFormAndSend()
        }
    }
)

window.addEventListener(
    'keydown',
    (event) =>
    {
        if(event.key === 'Enter' && _keyReady)
        {
            _keyReady = false

            buildFormAndSend()
        }
    }
)

/*===============================================//
// Removes the loading screen when everything
// is loaded
//===============================================*/

window.addEventListener(
    'DOMContentLoaded',
    () =>
    {
        _loading.style.display = 'none'
    }
)