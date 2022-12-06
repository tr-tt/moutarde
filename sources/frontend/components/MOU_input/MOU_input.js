import template from 'raw-loader!./MOU_input.html'

class MOUinput extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

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

        if(this.hasAttribute('placeholder'))
        {
            this._label.textContent = this.getAttribute('placeholder')
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
        this._input.classList.remove('error')
        this._input.classList.add('notempty')
    }

    _onBlurHandler()
    {
        if(!this._input.value)
        {
            this._input.classList.remove('notempty')
        }
    }

    get value()
    {
        let value = this._input.value

        if(this._input.required && !value)
        {
            this._input.classList.add('error')
        }
        
        if(!this._input.validity.valid)
        {
            this._input.classList.add('error')

            value = ''
        }

        return value
    }

    set value(value)
    {
        if(value)
        {
            this._input.classList.add('notempty')
        }
        
        this._input.value = value
    }
}

window.customElements.define('mou-input', MOUinput)

export default MOUinput