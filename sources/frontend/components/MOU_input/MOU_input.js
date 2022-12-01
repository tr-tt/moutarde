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
        this._input.type = this.getAttribute('type') || 'text'
        this._label.textContent = this.getAttribute('placeholder') || 'Placeholder'

        this._input.addEventListener('focus', this._onFocusHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._input.removeEventListener('focus', this._onFocusHandler)
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
        this._label.classList.remove('error')
    }

    get value()
    {
        const value = this._input.value

        if(!value)
        {
            this._input.classList.add('error')
            this._label.classList.add('error')
        }

        return value
    }

    set value(value)
    {
        this._input.value = value
    }
}

window.customElements.define('mou-input', MOUinput)

export default MOUinput