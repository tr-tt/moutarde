import AuthService from '../../services/auth.service'
import template from 'raw-loader!./MOU_signin.html'

class MOUsignin extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template

        this.button = this.shadowRoot.querySelector('#button')
        this.username = this.shadowRoot.querySelector('#username')
        this.password = this.shadowRoot.querySelector('#password')
    }

    connectedCallback()
    {
        this.button.addEventListener('click', this._onClickHandler.bind(this))
    }

    disconnectedCallback()
    {
        this.button.removeEventListener('click', this._onClickHandler)
    }

    _onClickHandler()
    {
        const username = this.username.value
        const password = this.password.value

        if (username && password)
        {
            AuthService
                .signin(username, password)
                .then((response) =>
                {
                    // [TODO] Success

                    console.log('[DEBUG] signin success -')
                    console.log(response)
                })
                .catch((exception) =>
                {
                    // [TODO] Error

                    console.log('[DEBUG] signin error -')
                    console.log(exception.response.data)
                })
        }
    }
}

window.customElements.define('mou-signin', MOUsignin)

export default MOUsignin