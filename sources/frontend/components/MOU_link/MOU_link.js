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

        if(this.hasAttribute('title'))
        {
            this._link.title = this.getAttribute('title')
        }

        this._link.classList.add(this.getAttribute('css') || 'default')
    }

    static get observedAttributes()
    {
        return ['label', 'href', 'title']
    }

    attributeChangedCallback(name, oldValue, newValue)
    {
        if(oldValue === newValue)
        {
            return;
        }

        if(name === 'label')
        {
            this._link.textContent = newValue || ''
        }

        if(name === 'href')
        {
            this._link.href = newValue || ''
        }

        if(name === 'title')
        {
            this._link.title = newValue || ''
        }
    }
}

window.customElements.define('mou-link', MOUlink)

export default MOUlink