import './index.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_copyright/MOU_copyright'
import '../../components/MOU_link/MOU_link'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})