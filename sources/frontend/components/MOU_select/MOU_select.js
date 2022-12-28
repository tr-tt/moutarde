import template from 'raw-loader!./MOU_select.html'

class MOUselect extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._select = this.shadowRoot.querySelector('select')
        this._label = this.shadowRoot.querySelector('label')
    }

    connectedCallback()
    {
        if(this.hasAttribute('required'))
        {
            this._select.required = true
        }

        if(this.hasAttribute('placeholder'))
        {
            this._label.textContent = this.getAttribute('placeholder')
        }

        this.shadowRoot.addEventListener('slotchange', this._onSlotChangeHandler.bind(this))
        this._select.addEventListener('focus', this._onFocusHandler.bind(this))
        this._select.addEventListener('blur', this._onBlurHandler.bind(this))
        this._select.addEventListener('change', this._onChangeHandler.bind(this))
    }

    disconnectedCallback()
    {
        this.shadowRoot.removeEventListener('slotchange', this._onSlotChangeHandler)
        this._select.removeEventListener('focus', this._onFocusHandler)
        this._select.removeEventListener('blur', this._onBlurHandler)
        this._select.removeEventListener('change', this._onChangeHandler)
    }

    _onChangeHandler()
    {
        this.dispatchEvent(new CustomEvent('mou-select:change', {detail: {value: this.value}}))
    }

    _onSlotChangeHandler()
    {
        const node = this.querySelector('option')

        if(node)
        {
            this._select.append(node)
            
            if(node.selected && node.value !== '')
            {
                this._select.classList.add('notempty')
            }
        }
    }

    _onFocusHandler()
    {
        this._select.classList.remove('error')
        this._select.classList.add('notempty')
    }

    _onBlurHandler()
    {
        if(!this._select.value)
        {
            this._select.classList.remove('notempty')
        }
    }

    get value()
    {
        let value = this._select.value

        if(this._select.required && !value)
        {
            this._select.classList.add('error')
        }
        
        if(!this._select.validity.valid)
        {
            this._select.classList.add('error')

            value = ''
        }

        return value
    }

    set value(value)
    {
        if(value)
        {
            this._select.classList.add('notempty')
        }
        
        this._select.value = value
    }
}

window.customElements.define('mou-select', MOUselect)

export default MOUselect