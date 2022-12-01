import './users_edit.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_usermenu/MOU_usermenu'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import UserService from '../../services/user.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _subtitle = document.querySelector('#subtitle')
const _username = document.querySelector('#username')
const _email = document.querySelector('#email')
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
    })

_button.addEventListener('click', () =>
{
    const username = _username.value === _current_username ? '' : _username.value
    const email = _email.value === _current_email ? '' : _email.value

    if(username || email)
    {
        UserService
            .putApiUser(username, email)
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
    else
    {
        _subtitle.textContent = `Le nom d'utilisateur ou l'addresse email doivent être modifiés avant d'enregistrer.`
        _subtitle.classList.add('error')
    }
})


