import AuthService from '../../services/auth.service'
import template from 'raw-loader!./MOU_signin.html'

class MOUsignin extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template

        this._button = this.shadowRoot.querySelector('#button')
        this._username = this.shadowRoot.querySelector('#username')
        this._password = this.shadowRoot.querySelector('#password')
        this._subtitle = this.shadowRoot.querySelector('#subtitle')
    }

    connectedCallback()
    {
        this._button.addEventListener('click', this._onClickHandler.bind(this))
    }

    disconnectedCallback()
    {
        this._button.removeEventListener('click', this._onClickHandler)
    }

    _onClickHandler()
    {
        this._subtitle.classList.remove('error')

        const username = this._username.value
        const password = this._password.value

        if (username && password)
        {
            AuthService
                .postApiAuthSignin(username, password)
                .then(() =>
                {
                    this._subtitle.textContent = `Bienvenu ${username}, vous allez être redirigé vers la page des tableaux`
                    this._subtitle.classList.add('success')

                    setTimeout(() =>
                    {
                        window.location.replace('board') // Redirect to login page with no ability to return back.
                    }, 1500)                    
                })
                .catch((exception) =>
                {
                    this._subtitle.textContent = exception.response.data.message
                    this._subtitle.classList.add('error')
                })
        }
    }
}

window.customElements.define('mou-signin', MOUsignin)

export default MOUsignin