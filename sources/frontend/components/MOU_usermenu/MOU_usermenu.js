import template from 'raw-loader!./MOU_usermenu.html'
import AuthService from '../../services/auth.service.js'

class MOUusermenu extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template

        this._logout = this.shadowRoot.querySelector('#logout')
    }

    connectedCallback()
    {
        this._logout.addEventListener('click', this._onClickHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._logout.removeEventListener('click', this._onClickHandler)
    }

    _onClickHandler()
    {
        AuthService
        .getApiAuthSignout()
    }
}

window.customElements.define('mou-usermenu', MOUusermenu)

export default MOUusermenu