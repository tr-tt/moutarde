import './posts_edit.css'
import '../../components/MOU_input_inline/MOU_input_inline'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_input_block/MOU_input_block'
import '../../components/MOU_input_picture/MOU_input_picture'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_opinion/MOU_opinion'
import PostService from '../../services/post.service'
import AuthService from '../../services/auth.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const post_id = window.location.pathname.replace('/posts/edit/', '')
const _logout = document.querySelector('#logout')
const _subtitle = document.querySelector('#subtitle')
const _confidential = document.querySelector('#confidential')
const _situation = document.querySelector('#situation')
const _tool = document.querySelector('#tool')
const _when = document.querySelector('#when')
const _feeling = document.querySelector('#feeling')
const _description = document.querySelector('#description')
const _ressource = document.querySelector('#ressource')
const _difficulty = document.querySelector('#difficulty')
const _trick = document.querySelector('#trick')
const _improvement = document.querySelector('#improvement')
const _more = document.querySelector('#more')
const _picture = document.querySelector('mou-input-picture')
const _button = document.querySelector('#button')
const _popup = document.querySelector('#popup')
const _popupProgress = document.querySelector('#popup__progress')
const _loading = document.querySelector('#loading')

let _buttonReady = true

/*===============================================//
// Logouts the user and redirects him to the
// index page when _logout button is clicked
//===============================================*/

_logout.addEventListener(
    'click',
    () =>
    {
        AuthService
            .getApiAuthSignout()
            .then(
                () =>
                {
                    window.location.href = '/'
                }
            )
            .catch(
                (exception) =>
                {
                    console.error(exception)
                }
            )
    }
)

PostService.
    getApiPostId(post_id)
    .then(
        (response) =>
        {
            if(response.data
                && response.data.message)
            {
                _confidential.checked = response.data.message.confidential || false
                _situation.value = response.data.message.situation || ''
                _tool.value = response.data.message.tool || ''

                const when = response.data.message.when || ''

                if(when)
                {
                    /*===============================================//
                    // [WARNING]
                    // Real date = 11/01/2023 15:00
                    // date stored in db = 2023-01-11 15:00:00+01
                    // date returnded by pg = 2023-01-11T14:00:00.000Z
                    //===============================================*/
                    const date = when.split('T')[0] || ''
                    const time = new Date(when).toLocaleTimeString([]) || ''

                    if(date && time)
                    {
                        _when.value = `${date}T${time}`
                    }
                }

                _feeling.value = response.data.message.feeling || ''
                _description.value = response.data.message.description || ''
                _ressource.value = response.data.message.ressource || ''
                _difficulty.value = response.data.message.difficulty || ''
                _trick.value = response.data.message.trick || ''
                _improvement.value = response.data.message.improvement || ''
                _more.value = response.data.message.more || ''
                _picture.value = response.data.message.Images
            }
            else
            {
                console.error('response not well formated')
            }

            _loading.style.display = 'none'
        }
    )
    .catch(
        (exception) =>
        {
            if(exception.response
                && exception.response.data
                && exception.response.data.message)
            {
                console.log(exception.response.data.message)
            }
            else
            {
                console.error(exception)
            }
        }
    )

/*===============================================//
// Tries to submit the form when the _button is
// clicked
//===============================================*/

const error = (message) =>
{
    _subtitle.textContent = message
    _subtitle.classList.add('error')

    _button.setAttribute('css', 'error')
    _buttonReady = true

    _popup.style.display = 'none'
    
    window.scrollTo(0, 0)
}

const buildFormAndSend = () =>
{
    const formData = new FormData()

    const confidential = _confidential.checked
    const situation = _situation.value
    const tool = _tool.value
    const when = _when.value
    const feeling = _feeling.value
    const description = _description.value
    const ressource = _ressource.value
    const difficulty = _difficulty.value
    const trick = _trick.value
    const improvement = _improvement.value
    const more = _more.value
    const picture = _picture.value

    formData.append('confidential', confidential)

    if(situation)
    {
        formData.append('situation', situation)
    }
    else
    {
        return error(`Le champ "Situation vécue" est requis.`)
    }

    if(tool)
    {
        formData.append('tool', tool)
    }

    if(when)
    {
        try
        {
            formData.append('when', new Date(when).toISOString())
        }
        catch(exception)
        {
            console.error(exception)
        }
    }

    if(feeling)
    {
        formData.append('feeling', feeling)
    }

    if(description)
    {
        formData.append('description', description)
    }

    if(ressource)
    {
        formData.append('ressource', ressource)
    }

    if(difficulty)
    {
        formData.append('difficulty', difficulty)
    }

    if(trick)
    {
        formData.append('trick', trick)
    }

    if(improvement)
    {
        formData.append('improvement', improvement)
    }

    if(more)
    {
        formData.append('more', more)
    }

    if(picture[0])
    {
        formData.append(`image0`, picture[0])
    }

    if(picture[1])
    {
        formData.append(`image1`, picture[1])
    }

    _popup.style.display = 'flex'
    
    PostService
        .putApiPostId(post_id, formData, _popupProgress)
        .then(
            () =>
            {
                window.location.href = '/posts'
            }
        )
        .catch(
            (exception) =>
            {
                if(exception.response
                    && exception.response.data
                    && exception.response.data.message)
                {
                    error(exception.response.data.message)
                }
                else
                {
                    console.error(exception)

                    error(`Une erreur est survenue.`)
                }
            }
        )
}

_button.addEventListener(
    'click',
    () =>
    {
        if(_buttonReady)
        {
            _buttonReady = false

            buildFormAndSend()
        }
    }
)