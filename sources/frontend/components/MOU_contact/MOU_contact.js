import template from 'raw-loader!./MOU_contact.html'

class MOUcontact extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._name = this.shadowRoot.querySelector('#name')
        this._job = this.shadowRoot.querySelector('#job')
        this._email = this.shadowRoot.querySelector('#email')
    }

    connectedCallback()
    {
        if(this.hasAttribute('name'))
        {
            this._name.textContent = this.getAttribute('name')
        }

        if(this.hasAttribute('job'))
        {
            this._job.textContent = this.getAttribute('job')
        }

        if(this.hasAttribute('email'))
        {
            this._email.textContent = this.getAttribute('email')
        }
    }
}

window.customElements.define('mou-contact', MOUcontact)

export default MOUcontact