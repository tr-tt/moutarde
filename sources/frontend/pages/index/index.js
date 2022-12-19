import './index.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_usermenu/MOU_usermenu'
import authService from '../../services/auth.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')

const _signin = document.querySelector('#signin')
const _signup = document.querySelector('#signup')
const _menu = document.querySelector('#menu')

_signin.style.display = 'none'
_signup.style.display = 'none'
_menu.style.display = 'none'

authService
    .getApiAuthSignin()
    .then((response) =>
    {
        _menu.style.display = 'block'
    })
    .catch((exception) =>
    {
        _signin.style.display = 'block'
        _signup.style.display = 'block'
    })

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})