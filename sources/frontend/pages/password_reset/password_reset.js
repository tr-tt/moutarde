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

const _loading = document.querySelector('#loading')

const _mouHeaderbar = document.querySelector('mou-headerbar')

const _subtitle = document.querySelector('#subtitle')
const _resetFields = document.querySelector('#reset__fields')
const _password = document.querySelector('#password')
const _confirmPassword = document.querySelector('#confirm__password')
const _show = document.querySelector('#show')
const _redirect = document.querySelector('#redirect')
const _button = document.querySelector('#button')
const _navigation = 
[
    {
        href: '/',
        label: `Page d'accueil`,
        css: 'default',
        title: `Retourner à la page d'accueil`
    },
    {
        href: '/posts',
        label: 'Mon carnet',
        css: 'default',
        title: 'Voir mon carnet'
    },
    {
        href: '/posts/new',
        label: 'Nouvelle page',
        css: 'colored',
        title: 'Créer une nouvelle page de carnet'
    },
    {
        href: '/users/edit',
        label: 'Mon profil',
        css: 'default',
        title: 'Voir mon profil'
    },
    {
        href: '/contact',
        label: 'Contacts',
        css: 'default',
        title: 'Voir les contacts'
    }
]

/*===============================================//
// Populate the navigation widget with all paths
// if the user is logged in or only connexion and
// create account path otherwise.
//===============================================*/

AuthService
    .getApiAuthSignin()
    .then(() =>
    {
        _navigation.forEach((navigation) =>
        {
            const _mouLink = document.createElement('mou-link')

            _mouLink.slot = 'controls'
            _mouLink.setAttribute('href', navigation.href)
            _mouLink.setAttribute('label', navigation.label)
            _mouLink.setAttribute('css', navigation.css)
            _mouLink.setAttribute('title', navigation.title)

            _mouHeaderbar.appendChild(_mouLink)
        })

        const _logout = document.createElement('mou-link')

        _logout.slot = 'controls'
        _logout.setAttribute('label', 'Se déconnecter')
        _logout.setAttribute('css', 'colored')
        _logout.setAttribute('title', 'Se déconnecter')
        _logout.addEventListener('click', () =>
        {
            AuthService
                .getApiAuthSignout()
                .then(() =>
                {
                    window.location.href = '/'
                })
                .catch((exception) =>
                {
                    console.error(exception)
                })
        })

        _mouHeaderbar.appendChild(_logout)

        _loading.style.display = 'none'
    })
    .catch(() =>
    {
        const _signin = document.createElement('mou-link')

        _signin.slot = 'controls'
        _signin.setAttribute('href', '/signin')
        _signin.setAttribute('label', 'Se connecter')
        _signin.setAttribute('css', 'default')
        _signin.setAttribute('title', 'Se connecter')

        const _signup = document.createElement('mou-link')

        _signup.slot = 'controls'
        _signup.setAttribute('href', '/signup')
        _signup.setAttribute('label', 'Créer un compte')
        _signup.setAttribute('css', 'colored')
        _signup.setAttribute('title', 'Créer un compte')

        _mouHeaderbar.appendChild(_signin)
        _mouHeaderbar.appendChild(_signup)

        _loading.style.display = 'none'
    })

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
                .then(() =>
                {
                    _resetFields.style.display = 'none'
                    _button.style.display = 'none'
                    _redirect.setAttribute('label', 'Se connecter')
                    _redirect.setAttribute('css', 'colored')
                })
                .catch((exception) =>
                {
                    console.error(exception)
                })
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