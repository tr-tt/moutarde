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
        this._usermenuFields = this.shadowRoot.querySelector('#usermenu__fields')
        this._logout = this.shadowRoot.querySelector('#logout')
    }

    connectedCallback()
    {
        this._logout.addEventListener('click', this._onClickHandler.bind(this))
        this._usermenu.addEventListener('click', this._onMenuClickHandler.bind(this))
        window.addEventListener('click', this._onWindowClickHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._logout.removeEventListener('click', this._onClickHandler)
        this._usermenu.removeEventListener('click', this._onMenuClickHandler)
        window.removeEventListener('click', this._onWindowClickHandler)
    }

    _onMenuClickHandler()
    {
        this._usermenuFields.classList.toggle('hide')
    }

    _onClickHandler()
    {
        AuthService
            .getApiAuthSignout()
    }

    _onWindowClickHandler(event)
    {
        if(event.target !== this)
        {
            this._usermenuFields.classList.add('hide')
        }
    }
}

window.customElements.define('mou-usermenu', MOUusermenu)

export default MOUusermenu