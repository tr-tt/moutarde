import template from 'raw-loader!./MOU_upload.html'

class MOUupload extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._delete = this.shadowRoot.querySelector('#delete')
        this._input = this.shadowRoot.querySelector('input')
        this._label = this.shadowRoot.querySelector('label')
        this._image = this.shadowRoot.querySelector('img')

        this._blob = null
    }

    connectedCallback()
    {
        this._delete.addEventListener('click', this._onDeleteHandler.bind(this))
        this._input.addEventListener('change', this._onChangeHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._delete.removeEventListener('click', this._onDeleteHandler)
        this._input.removeEventListener('change', this._onChangeHandler)
    }

    _onDeleteHandler()
    {
        this._blob = null

        this._image.src = '/static/images/jpgOrPng.jpg'
    }

    _onChangeHandler()
    {
        const [file] = this._input.files

        if(file)
        {
            this._blob = file

            this._image.src = URL.createObjectURL(this._blob)
        }
    }

    get value()
    {
        return this._blob
    }

    set value(value)
    {
        if(value)
        {
            const image = new Uint8Array(value.data)

            this._blob = new Blob([image])

            try
            {
                this._image.src = URL.createObjectURL(this._blob)
            }
            catch(exception)
            {
                console.error(exception.message)
            }
        }
    }
}

window.customElements.define('mou-upload', MOUupload)

export default MOUupload