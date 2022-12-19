import template from 'raw-loader!./MOU_textarea.html'

class MOUtextarea extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._textarea = this.shadowRoot.querySelector('textarea')
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
        this._textarea.classList.remove('error')
        this._textarea.classList.add('notempty')
    }

    _onBlurHandler()
    {
        if(!this._textarea.value)
        {
            this._textarea.classList.remove('notempty')
        }
    }

    get value()
    {
        let value = this._textarea.value

        if(this._textarea.required && !value)
        {
            this._textarea.classList.add('error')
        }
        
        if(!this._textarea.validity.valid)
        {
            this._textarea.classList.add('error')

            value = ''
        }

        return value
    }

    set value(value)
    {
        if(value)
        {
            this._textarea.classList.add('notempty')
        }
        
        this._textarea.value = value
    }
}

window.customElements.define('mou-textarea', MOUtextarea)

export default MOUtextarea