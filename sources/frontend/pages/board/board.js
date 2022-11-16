import '../../common/style.css'
import './board.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import AuthService from '../../services/auth.service.js'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const button = document.querySelector('#button')

button.addEventListener('click', () =>
{
    AuthService.logout()
})