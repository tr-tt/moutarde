import './index.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_copyright/MOU_copyright'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}