import './password_forgot.css'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_headerbar/MOU_headerbar'
import userService from '../../services/user.service'
import authService from '../../services/auth.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')

const _mouHeaderbar = document.querySelector('mou-headerbar')

const _subtitle = document.querySelector('#subtitle')
const _emailOrUsername = document.querySelector('#email_or_username')
const _button = document.querySelector('#button')

const _navigation = 
[
    {
        href: '/',
        label: `Page d'accueil`,
        css: 'default'
    },
    {
        href: '/posts',
        label: 'Mes formulaires',
        css: 'default'
    },
    {
        href: '/posts/new',
        label: 'Nouveau formulaire',
        css: 'colored'
    },
    {
        href: '/users/edit',
        label: 'Mon profil',
        css: 'default'
    },
    {
        href: '/contact',
        label: 'Contacts',
        css: 'default'
    }
]

authService
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

            _mouHeaderbar.appendChild(_mouLink)
        })

        const _logout = document.createElement('mou-link')

        _logout.slot = 'controls'
        _logout.setAttribute('label', 'Se déconnecter')
        _logout.setAttribute('css', 'colored')
        _logout.addEventListener('click', () =>
        {
            authService
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

        const _signup = document.createElement('mou-link')

        _signup.slot = 'controls'
        _signup.setAttribute('href', '/signup')
        _signup.setAttribute('label', 'Créer un compte')
        _signup.setAttribute('css', 'colored')

        _mouHeaderbar.appendChild(_signin)
        _mouHeaderbar.appendChild(_signup)

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

    userService
        .postApiUserPasswordForgot(formData)
        .then((response) =>
        {
            _subtitle.textContent = response.data.message
            _subtitle.classList.remove('error')
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