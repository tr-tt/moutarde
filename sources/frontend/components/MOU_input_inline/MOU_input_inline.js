import template from 'raw-loader!./MOU_input_inline.html'

class MOUInputInline extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._inputInlineFields = this.shadowRoot.querySelector('#input__inline__fields')
        this._input = this.shadowRoot.querySelector('input')
        this._label = this.shadowRoot.querySelector('label')
    }

    connectedCallback()
    {
        if(this.hasAttribute('type'))
        {
            this._input.type = this.getAttribute('type')
        }

        if(this.hasAttribute('maxlength'))
        {
            this._input.maxLength = this.getAttribute('maxlength')
        }

        if(this.hasAttribute('min'))
        {
            this._input.min = this.getAttribute('min')
        }

        if(this.hasAttribute('max'))
        {
            this._input.max = this.getAttribute('max')
        }

        if(this.hasAttribute('required'))
        {
            this._input.required = true
        }

        if(this.hasAttribute('disabled'))
        {
            this._input.disabled = true
        }

        if(this.hasAttribute('placeholder'))
        {
            this._label.textContent = this.getAttribute('placeholder')
        }
        else
        {
            this._label.classList.add('hide')
        }
        
        this._input.addEventListener('focus', this._onFocusHandler.bind(this))
        this._input.addEventListener('blur', this._onBlurHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._input.removeEventListener('focus', this._onFocusHandler)
        this._input.removeEventListener('blur', this._onBlurHandler)
    }

    static get observedAttributes()
    {
        return ['type']
    }

    attributeChangedCallback(name, oldValue, newValue)
    {
        if (oldValue === newValue)
        {
            return;
        }

        if (name === 'type')
        {
            this._input.type = this.getAttribute('type') || 'text'
        }
    }

    _onFocusHandler()
    {
        this._inputInlineFields.classList.remove('error')
        this._inputInlineFields.classList.add('focus')

        this._label.classList.remove('filled')
        this._label.classList.remove('error')
        this._label.classList.add('move')
    }

    _onBlurHandler()
    {
        this._inputInlineFields.classList.remove('focus')

        if(!this._input.value)
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
        const value = this._input.value

        if(!value && this._input.required)
        {
            this._inputInlineFields.classList.add('error')

            this._label.classList.add('error')
        }

        return value
    }

    set value(value)
    {   
        if(value)
        {
            this._label.classList.add('move')
            this._label.classList.add('filled')
        }

        this._input.value = value
    }
}

window.customElements.define('mou-input-inline', MOUInputInline)

export default MOUInputInline