import './posts_new.css'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_textarea/MOU_textarea'
import '../../components/MOU_upload/MOU_upload'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_usermenu/MOU_usermenu'
import postService from '../../services/post.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _subtitle = document.querySelector('#subtitle')
const _formFields = document.querySelector('#form__fields')

const _title = document.querySelector('#title')
const _tool = document.querySelector('#tool')
const _mouUpload = document.querySelector('mou-upload')

const _posts = document.querySelector('#posts')
const _button = document.querySelector('#button')

const _loading = document.querySelector('#loading')

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})

_button.addEventListener('click', () =>
{
    const formData = new FormData()

    const title = _title.value
    const tool = _tool.value
    const image = _mouUpload.value

    if(title)
    {
        formData.append('title', title)
    }
    else
    {
        _subtitle.textContent = `Un titre pour le formulaire est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(tool)
    {
        formData.append('tool', tool)
    }
    else
    {
        _subtitle.textContent = `Un outil cible est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(image)
    {
        formData.append('image', image)
    }
    
    postService
        .postApiPost(formData)
        .then(() =>
        {
            _subtitle.textContent = `Votre formulaire a été enregistré, vous pouvez consulter la liste de vos formulaires.`
            _subtitle.classList.remove('error')

            _formFields.innerHTML = ''
            _button.style.display = 'none'
            _posts.setAttribute('label', 'Mes formulaires')
            _posts.setAttribute('css', 'colored')

        })
        .catch((exception) =>
        {
            _subtitle.textContent = exception.response.data.message
            _subtitle.classList.add('error')
        })
})