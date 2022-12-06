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
        this._label.textContent = this.getAttribute('placeholder') || 'Placeholder'
    }
}

window.customElements.define('mou-textarea', MOUtextarea)

export default MOUtextarea