import template from 'raw-loader!./MOU_input_picture.html'
import {compressAccurately} from 'image-conversion'

class MOUInputPicture extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._photo0 = this.shadowRoot.querySelector('#photo__0')
        this._photo1 = this.shadowRoot.querySelector('#photo__1')
        this._input0 = this.shadowRoot.querySelector('#input__0')
        this._input1 = this.shadowRoot.querySelector('#input__1')
        this._img0 = this.shadowRoot.querySelector('#img__0')
        this._img1 = this.shadowRoot.querySelector('#img__1')
        this._delete0 = this.shadowRoot.querySelector('#delete__0')
        this._delete1 = this.shadowRoot.querySelector('#delete__1')

        this._file0 = null
        this._file1 = null

        this._maxSize = 1000 // KB = 1MB
    }

    connectedCallback()
    {
        this._input0.addEventListener('change', this._onChangeInput0Handler.bind(this))
        this._input1.addEventListener('change', this._onChangeInput1Handler.bind(this))

        this._delete0.addEventListener('click', this._onDelete0Handler.bind(this))
        this._delete1.addEventListener('click', this._onDelete1Handler.bind(this))
        
    }

    disconnectedCallback()
    {
        this._input0.removeEventListener('change', this._onChangeInput0Handler)
        this._input1.removeEventListener('change', this._onChangeInput1Handler)

        this._delete0.removeEventListener('click', this._onDelete0Handler)
        this._delete1.removeEventListener('click', this._onDelete1Handler)
    }

    _onChangeInput0Handler()
    {
        const [file] = this._input0.files

        if(file)
        {
            compressAccurately(file, this._maxSize)
                .then((blob) =>
                {
                    this._file0 = new File([blob], file.name)

                    this._img0.src = URL.createObjectURL(this._file0)
                    this._img0.classList.remove('hide')

                    this._delete0.setAttribute('label', 'Supprimer')
                    this._delete0.setAttribute('css', 'default')
                    this._delete0.classList.add('above')
                })
                .catch((exception) =>
                {
                    console.error(exception)
                })
        }
    }

    _onChangeInput1Handler()
    {
        const [file] = this._input1.files

        if(file)
        {
            compressAccurately(file, this._maxSize)
                .then((blob) =>
                {
                    this._file1 = new File([blob], file.name)

                    this._img1.src = URL.createObjectURL(this._file1)
                    this._img1.classList.remove('hide')

                    this._delete1.setAttribute('label', 'Supprimer')
                    this._delete1.setAttribute('css', 'default')
                    this._delete1.classList.add('above')
                })
                .catch((exception) =>
                {
                    console.error(exception)
                })
        }
    }

    _onDelete0Handler()
    {
        this._img0.src = '/static/images/icons/10_appareil_photo.png'
        this._img0.classList.add('hide')

        this._delete0.setAttribute('label', 'Photo n°1')
        this._delete0.setAttribute('css', 'colored')
        this._delete0.classList.remove('above')

        this._file0 = null
    }

    _onDelete1Handler()
    {
        this._img1.src = '/static/images/icons/10_appareil_photo.png'
        this._img1.classList.add('hide')

        this._delete1.setAttribute('label', 'Photo n°2')
        this._delete1.setAttribute('css', 'colored')
        this._delete1.classList.remove('above')

        this._file1 = null
    }

    get value()
    {
        return [this._file0, this._file1]
    }

    set value(value)
    {
        if(value
            && value[0]
            && value[0].blob
            && value[0].blob.data
            && value[0].type
            && value[0].name)
        {
            const blob = new Blob([new Uint8Array(value[0].blob.data)], {type: value[0].type})

            this._file0 = new File([blob], value[0].name)

            this._img0.src = URL.createObjectURL(this._file0)
            this._img0.classList.remove('hide')

            this._delete0.setAttribute('label', 'Supprimer')
            this._delete0.setAttribute('css', 'default')
            this._delete0.classList.add('above')
        }

        if(value
            && value[1]
            && value[1].blob
            && value[1].blob.data
            && value[1].type
            && value[1].name)
        {
            const blob = new Blob([new Uint8Array(value[1].blob.data)], {type: value[1].type})

            this._file1 = new File([blob], value[1].name)

            this._img1.src = URL.createObjectURL(this._file1)
            this._img1.classList.remove('hide')

            this._delete1.setAttribute('label', 'Supprimer')
            this._delete1.setAttribute('css', 'default')
            this._delete1.classList.add('above')
        }
    }
}

window.customElements.define('mou-input-picture', MOUInputPicture)

export default MOUInputPicture