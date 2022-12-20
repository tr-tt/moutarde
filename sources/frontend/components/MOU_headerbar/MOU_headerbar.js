import template from 'raw-loader!./MOU_headerbar.html'

class MOUheaderbar extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template

        this._headerLogo = this.shadowRoot.querySelector('#header__logo')
        this._navigation = this.shadowRoot.querySelector('#navigation')
        this._navigationFields = this.shadowRoot.querySelector('#navigation__fields')
    }

    connectedCallback()
    {
        this._headerLogo.addEventListener('click', this._onClickHandler.bind(this))
        this._navigation.addEventListener('click', this._onNavigationClickHandler.bind(this))
        window.addEventListener('click', this._onWindowClickHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._headerLogo.removeEventListener('click', this._onClickHandler)
        this._navigation.removeEventListener('click', this._onNavigationClickHandler)
        window.removeEventListener('click', this._onWindowClickHandler)
    }

    _onClickHandler()
    {
        window.location.href = '/'
    }

    _onNavigationClickHandler()
    {
        this._navigationFields.classList.toggle('hide')
    }

    _onWindowClickHandler(event)
    {
        if(event.target !== this)
        {
            this._navigationFields.classList.add('hide')
        }
    }
}

window.customElements.define('mou-headerbar', MOUheaderbar)

export default MOUheaderbar