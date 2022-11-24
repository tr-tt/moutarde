import template from 'raw-loader!./MOU_headerbar.html'

class MOUheaderbar extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template

        this._header__logo = this.shadowRoot.querySelector('#header__logo')
    }

    connectedCallback()
    {
        this._header__logo.addEventListener('click', this._onClickHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._header__logo.removeEventListener('click', this._onClickHandler)
    }

    _onClickHandler()
    {
        window.location.href = '/'
    }
}

window.customElements.define('mou-headerbar', MOUheaderbar)

export default MOUheaderbar