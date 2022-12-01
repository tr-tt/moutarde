import './password_forgot.css'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import UserService from '../../services/user.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _subtitle = document.querySelector('#subtitle')
const _emailOrUsername = document.querySelector('#email_or_username')
const _button = document.querySelector('#button')

_button.addEventListener('click', () =>
{
    const emailOrUsername = _emailOrUsername.value

    if(!emailOrUsername)
    {
        _subtitle.textContent = `Une addresse email ou un nom d'utilisateur est requis pour changer votre mot de passe.`
        _subtitle.classList.add('error')
    }
    else
    {
        UserService
            .postApiUserPasswordForgot(emailOrUsername)
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