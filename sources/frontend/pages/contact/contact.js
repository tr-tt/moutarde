import './contact.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_post/MOU_post'
import authService from '../../services/auth.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')
const _logout = document.querySelector('#logout')

/*===============================================//
// Logouts the user and redirects him to the
// index page when _logout button is clicked
//===============================================*/

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

/*===============================================//
// Removes the loading screen when everything
// is loaded
//===============================================*/

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})