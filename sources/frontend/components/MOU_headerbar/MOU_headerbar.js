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
        this._navigationFields.addEventListener('click', this._onWindowClickHandler.bind(this))
        window.addEventListener('click', this._onWindowClickHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._headerLogo.removeEventListener('click', this._onClickHandler)
        this._navigation.removeEventListener('click', this._onNavigationClickHandler)
        this._navigationFields.removeEventListener('click', this._onWindowClickHandler)
        window.removeEventListener('click', this._onWindowClickHandler)
    }

    _onClickHandler()
    {
        window.location.href = '/'
    }

    _onNavigationClickHandler()
    {
        this._navigationFields.classList.toggle('hide')

        if(this._navigationFields.classList.contains('hide'))
        {
            this._navigation.setAttribute('css', 'colored')
        }
        else
        {
            this._navigation.setAttribute('css', 'active')
        }
    }

    _onWindowClickHandler(event)
    {
        if(event.target !== this)
        {
            this._navigationFields.classList.add('hide')
            this._navigation.setAttribute('css', 'colored')
        }
    }
}

window.customElements.define('mou-headerbar', MOUheaderbar)

export default MOUheaderbar