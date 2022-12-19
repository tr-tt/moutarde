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

        this._date = this.shadowRoot.querySelector('#date')
        this._image = this.shadowRoot.querySelector('img')
        this._title = this.shadowRoot.querySelector('#title')
        this._tool = this.shadowRoot.querySelector('#tool')
        this._description = this.shadowRoot.querySelector('#description')
        this._popup = this.shadowRoot.querySelector('#popup')
        this._subtitle = this.shadowRoot.querySelector('#subtitle')
        
        this._edit = this.shadowRoot.querySelector('#edit')
        this._delete = this.shadowRoot.querySelector('#delete')
        this._cancel = this.shadowRoot.querySelector('#cancel')
        this._confirm = this.shadowRoot.querySelector('#confirm')
    }

    connectedCallback()
    {
        if(this.hasAttribute('createdAt'))
        {
            const date = new Date(this.getAttribute('createdAt'))

            this._date.textContent = date.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})
        }

        if(this.hasAttribute('title'))
        {
            this._title.textContent = this.getAttribute('title')
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
                this._subtitle.textContent = exception.response.data.message
                this._subtitle.classList.add('error')
            })
    }

    set id(value)
    {
        this._id = value

        this._edit.setAttribute('href', `/posts/edit/${this._id}`)
    }

    set image(value)
    {
        if(value)
        {
            const image = new Uint8Array(value.data)

            try
            {
                this._image.src = URL.createObjectURL(new Blob([image]))
            }
            catch(exception)
            {
                console.error(exception.message)
            }
        }
    }
}

window.customElements.define('mou-post', MOUpost)

export default MOUpost