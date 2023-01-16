import template from 'raw-loader!./MOU_select.html'

class MOUselect extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._inputSelectFields = this.shadowRoot.querySelector('#input__select__fields')
        this._select = this.shadowRoot.querySelector('select')
        this._label = this.shadowRoot.querySelector('label')
    }

    connectedCallback()
    {
        if(this.hasAttribute('placeholder'))
        {
            this._label.textContent = this.getAttribute('placeholder')
        }
        else
        {
            this._label.classList.add('hide')
        }

        if(this.hasAttribute('required'))
        {
            this._select.required = true
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
                this._label.classList.add('move')
                this._label.classList.add('filled')
            }
        }
    }

    _onFocusHandler()
    {
        this._inputSelectFields.classList.remove('error')
        this._inputSelectFields.classList.add('focus')

        this._label.classList.remove('filled')
        this._label.classList.remove('error')
        this._label.classList.add('move')
    }

    _onBlurHandler()
    {
        this._inputSelectFields.classList.remove('focus')

        if(!this._select.value)
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
        const value = this._select.value

        if(!value && this._select.required)
        {
            this._inputSelectFields.classList.add('error')

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
        
        this._select.value = value
    }
}

window.customElements.define('mou-select', MOUselect)

export default MOUselect