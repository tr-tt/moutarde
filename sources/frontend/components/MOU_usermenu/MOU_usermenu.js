import template from 'raw-loader!./MOU_usermenu.html'
import AuthService from '../../services/auth.service.js'
import '../MOU_link/MOU_link'

class MOUusermenu extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template

        this._usermenu = this.shadowRoot.querySelector('#usermenu')
        this._usermenu__frame = this.shadowRoot.querySelector('#usermenu__frame')
        this._logout = this.shadowRoot.querySelector('#logout')
    }

    connectedCallback()
    {
        this._logout.addEventListener('click', this._onClickHandler.bind(this))
        this._usermenu.addEventListener('click', this._onMenuClickHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._logout.removeEventListener('click', this._onClickHandler)
        this._usermenu.removeEventListener('click', this._onMenuClickHandler)
    }

    _onMenuClickHandler()
    {
        this._usermenu__frame.classList.toggle('hide')
    }

    _onClickHandler()
    {
        AuthService
            .getApiAuthSignout()
    }
}

window.customElements.define('mou-usermenu', MOUusermenu)

export default MOUusermenu