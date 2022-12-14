import './password_forgot.css'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_headerbar/MOU_headerbar'
import UserService from '../../services/user.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _subtitle = document.querySelector('#subtitle')
const _emailOrUsername = document.querySelector('#email_or_username')
const _button = document.querySelector('#button')

const _loading = document.querySelector('#loading')

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})

_button.addEventListener('click', () =>
{
    const formData = new FormData()

    const emailOrUsername = _emailOrUsername.value

    if(emailOrUsername)
    {
        formData.append('emailOrUsername', emailOrUsername)
    }
    else
    {
        _subtitle.textContent = `Une addresse email ou un nom d'utilisateur est requis pour changer votre mot de passe.`
        _subtitle.classList.add('error')

        return
    }

    UserService
        .postApiUserPasswordForgot(formData)
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
})