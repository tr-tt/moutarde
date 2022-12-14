import './contact.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_usermenu/MOU_usermenu'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_post/MOU_post'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})