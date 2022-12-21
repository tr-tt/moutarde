import './index.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_link/MOU_link'
import authService from '../../services/auth.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')

const _mouHeaderbar = document.querySelector('mou-headerbar')

const _chart = document.querySelector('#chart')

const _navigation = 
[
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

_chart.addEventListener('click', () =>
{
    window.open('/chart', '_blank')
})

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
