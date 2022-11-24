import './board.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_usermenu/MOU_usermenu'
import '../../components/MOU_board/MOU_board'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _button = document.querySelector('#button')
const _mou_usermenu = document.querySelector('mou-usermenu')

_button.addEventListener('click', () =>
{
    _button.classList.toggle('active')

    if(_button.classList.contains('active'))
    {
        _mou_usermenu.style.display = 'block'
    }
    else
    {
        _mou_usermenu.style.display = 'none'
    }
})