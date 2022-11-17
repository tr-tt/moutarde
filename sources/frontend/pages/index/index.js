import './index.css'
import '../../components/MOU_headerbar/MOU_headerbar'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}
