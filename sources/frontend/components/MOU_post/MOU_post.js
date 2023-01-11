import template from 'raw-loader!./MOU_post.html'
import postService from '../../services/post.service'

class MOUpost extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._id = 0

        this._when = this.shadowRoot.querySelector('#when')
        this._svg = this.shadowRoot.querySelector('#camera')
        this._image = this.shadowRoot.querySelector('img')
        this._situation = this.shadowRoot.querySelector('#situation')
        this._tool = this.shadowRoot.querySelector('#tool')
        this._description = this.shadowRoot.querySelector('#description')
        this._popup = this.shadowRoot.querySelector('#popup')
        this._popupSubtitle = this.shadowRoot.querySelector('#popup__subtitle')
        
        this._edit = this.shadowRoot.querySelector('#edit')
        this._delete = this.shadowRoot.querySelector('#delete')
        this._cancel = this.shadowRoot.querySelector('#cancel')
        this._confirm = this.shadowRoot.querySelector('#confirm')
    }

    connectedCallback()
    {
        if(this.hasAttribute('when'))
        {
            /*===============================================//
            // [WARNING]
            // Real date = 11/01/2023 15:00
            // date stored in db = 2023-01-11 15:00:00+01
            // date returnded by pg = 2023-01-11T14:00:00.000Z
            //===============================================*/
            const date = new Date(this.getAttribute('when'))

            this._when.textContent = date.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})
        }

        if(this.hasAttribute('situation'))
        {
            this._situation.textContent = this.getAttribute('situation')
        }

        if(this.hasAttribute('tool'))
        {
            this._tool.textContent = this.getAttribute('tool')
        }

        if(this.hasAttribute('description'))
        {
            this._description.textContent = this.getAttribute('description')
        }

        this._delete.addEventListener('click', this._onDeleteHandler.bind(this))
        this._cancel.addEventListener('click', this._onCancelHandler.bind(this))
        this._confirm.addEventListener('click', this._onConfirmHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._delete.removeEventListener('click', this._onDeleteHandler)
        this._cancel.removeEventListener('click', this._onCancelHandler)
        this._confirm.removeEventListener('click', this._onConfirmHandler)

    }

    _onDeleteHandler()
    {
        this._popup.style.display = 'flex'
    }

    _onCancelHandler()
    {
        this._popup.style.display = 'none'
    }

    _onConfirmHandler()
    {
        postService
            .deleteApiPost(this._id)
            .then(() =>
            {
                this.dispatchEvent(new Event('mou-post:delete'))
                
                this.remove()
            })
            .catch((exception) =>
            {
                if(exception.response
                    && exception.response.data
                    && exception.response.data.message)
                {
                    this._popupSubtitle.textContent = exception.response.data.message
                    this._popupSubtitle.classList.add('error')
                }
                else
                {
                    console.error(exception)
                }
            })
    }

    set id(value)
    {
        this._id = value

        this._edit.setAttribute('href', `/posts/edit/${this._id}`)
    }

    set images(value)
    {
        if(value
            && value[0]
            && value[0].blob
            && value[0].blob.data
            && value[0].type
        )
        {
            try
            {
                this._image.src = URL.createObjectURL(new Blob([new Uint8Array(value[0].blob.data)], {type: value[0].type}))

                this._svg.classList.add('hide')
                this._image.classList.remove('hide')
            }
            catch(exception)
            {
                console.error(exception)
            }
        }
        else if(value
            && value[1]
            && value[1].blob
            && value[1].blob.data
            && value[1].type
        )
        {
            try
            {
                this._image.src = URL.createObjectURL(new Blob([new Uint8Array(value[1].blob.data)], {type: value[1].type}))

                this._svg.classList.add('hide')
                this._image.classList.remove('hide')
            }
            catch(exception)
            {
                console.error(exception)
            }
        }
    }
}

window.customElements.define('mou-post', MOUpost)

export default MOUpost