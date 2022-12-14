import template from 'raw-loader!./MOU_link.html'

class MOUlink extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template

        this._link = this.shadowRoot.querySelector('a')
    }

    connectedCallback()
    {
        if(this.hasAttribute('href'))
        {
            this._link.href = this.getAttribute('href')
        }
        
        if(this.hasAttribute('label'))
        {
            this._link.textContent = this.getAttribute('label')
        }
        
        this._link.classList.add(this.getAttribute('css') || 'default')
    }

    static get observedAttributes()
    {
        return ['css', 'label', 'href']
    }

    attributeChangedCallback(name, oldValue, newValue)
    {
        if(oldValue === newValue)
        {
            return;
        }

        if(name === 'css')
        {
            this._link.classList.remove(...this._link.classList)
            this._link.classList.add(this.getAttribute('css') || 'default')
        }

        if(name === 'label')
        {
            this._link.textContent = newValue || 'Link'
        }

        if(name === 'href')
        {
            this._link.href = newValue || ''
        }
    }
}

window.customElements.define('mou-link', MOUlink)

export default MOUlink