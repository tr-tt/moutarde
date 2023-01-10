import template from 'raw-loader!./MOU_input_block.html'

class MOUInputBlock extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._inputBlockFields = this.shadowRoot.querySelector('#input__block__fields')
        this._textarea = this.shadowRoot.querySelector('textarea')
        this._icon = this.shadowRoot.querySelector('#icon')
        this._img = this.shadowRoot.querySelector('img')
        this._label = this.shadowRoot.querySelector('label')
    }

    connectedCallback()
    {
        if(this.hasAttribute('maxlength'))
        {
            this._textarea.maxLength = this.getAttribute('maxlength')
        }

        if(this.hasAttribute('required'))
        {
            this._textarea.required = true
        }

        if(this.hasAttribute('placeholder'))
        {
            this._label.textContent = this.getAttribute('placeholder')
        }
        else
        {
            this._label.classList.add('hide')
        }

        if(this.hasAttribute('icon'))
        {
            this._img.src = this.getAttribute('icon')
            this._label.classList.add('icon')
        }
        else
        {
            this._icon.classList.add('hide')
        }

        this._textarea.addEventListener('focus', this._onFocusHandler.bind(this))
        this._textarea.addEventListener('blur', this._onBlurHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._textarea.removeEventListener('focus', this._onFocusHandler)
        this._textarea.removeEventListener('blur', this._onBlurHandler)
    }

    _onFocusHandler()
    {
        this._inputBlockFields.classList.add('focus')

        this._icon.classList.add('focus')

        this._label.classList.remove('filled')
        this._label.classList.add('move')
    }

    _onBlurHandler()
    {
        this._inputBlockFields.classList.remove('focus')

        this._icon.classList.remove('focus')

        if(!this._textarea.value)
        {
            this._label.classList.remove('move')
        }
        else
        {
            this._label.classList.add('filled')
        }
    }

    get value()
    {
        return this._textarea.value
    }

    set value(value)
    {
        if(value)
        {
            this._label.classList.add('move')
            this._label.classList.add('filled')
        }
        
        this._textarea.value = value
    }
}

window.customElements.define('mou-input-block', MOUInputBlock)

export default MOUInputBlock