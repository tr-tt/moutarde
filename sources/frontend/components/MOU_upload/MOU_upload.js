import template from 'raw-loader!./MOU_upload.html'

class MOUupload extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._input = this.shadowRoot.querySelector('input')
        this._label = this.shadowRoot.querySelector('label')
        this._image = this.shadowRoot.querySelector('img')
    }

    connectedCallback()
    {
        this._input.addEventListener('change', this._onChangeHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._input.removeEventListener('change', this._onChangeHandler)
    }

    _onChangeHandler()
    {
        const [file] = this._input.files

        if(file)
        {
            this._image.src = URL.createObjectURL(file)
        }
        else
        {
            this._image.src = '/static/images/logo.jpg'
        }
    }
}

window.customElements.define('mou-upload', MOUupload)

export default MOUupload