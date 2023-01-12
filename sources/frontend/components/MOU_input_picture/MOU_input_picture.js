import template from 'raw-loader!./MOU_input_picture.html'

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

        this._maxSize = 1048576 * 10 // 10MB in Bytes binary
        this._maxWidth = 800
        this._maxHeight = 600
        this._quality = 0.6
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

    _resizeImg(srcFile)
    {
        return new Promise((resolve, reject) =>
        {
            const reader = new FileReader()

            reader.onload = (event) =>
            {
                const img = document.createElement('img')
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
    
                img.src = event.target.result
    
                img.onload = () =>
                {
                    let width = img.width
                    let height = img.height
    
                    if(width > height)
                    {
                        if (width > this._maxWidth)
                        {
                            height *= this._maxWidth / width
                            width = this._maxWidth
                        }
                    }
                    else
                    {
                        if(height > this._maxHeight)
                        {
                            width *= this._maxHeight / height
                            height = this._maxHeight
                        }
                    }
    
                    canvas.width = width
                    canvas.height = height
                    ctx.drawImage(img, 0, 0, width, height)
    
                    canvas.toBlob(
                        (blob) =>
                        {
                            const file = new File([blob], srcFile.name)
            
                            if(file.size < this._maxSize)
                            {
                                resolve(file)
                            }
                            else
                            {
                                reject('Taille max 10MB')
                            }
                        },
                        srcFile.type,
                        this._quality
                    )
                }
            }
    
            if(srcFile.size > this._maxSize)
            {
                reader.readAsDataURL(srcFile)
            }
            else
            {
                resolve(srcFile)
            }
        })
    }

    _onChangeInput0Handler()
    {
        const [srcFile] = this._input0.files

        if(srcFile)
        {
            this._resizeImg(srcFile)
                .then((dstFile) =>
                    {
                        this._file0 = dstFile

                        this._img0.src = URL.createObjectURL(this._file0)
                        this._img0.classList.remove('hide')

                        this._delete0.setAttribute('label', 'Supprimer')
                        this._delete0.setAttribute('css', 'default')
                        this._delete0.classList.add('above')

                    })
                    .catch((exception) =>
                    {
                        this._delete0.setAttribute('label', exception)
                        this._delete0.setAttribute('css', 'error')
                    })
        }
    }

    _onChangeInput1Handler()
    {
        const [srcFile] = this._input1.files

        if(srcFile)
        {
            this._resizeImg(srcFile)
                .then((dstFile) =>
                    {
                        this._file1 = dstFile

                        this._img1.src = URL.createObjectURL(this._file1)
                        this._img1.classList.remove('hide')

                        this._delete1.setAttribute('label', 'Supprimer')
                        this._delete1.setAttribute('css', 'default')
                        this._delete1.classList.add('above')

                    })
                    .catch((exception) =>
                    {
                        this._delete1.setAttribute('label', exception)
                        this._delete1.setAttribute('css', 'error')
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