import AuthService from '../../services/auth.service'
import template from 'raw-loader!./MOU_signup.html'

class MOUsignup extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template

        this.button = this.shadowRoot.querySelector('#button')
        this.username = this.shadowRoot.querySelector('#username')
        this.email = this.shadowRoot.querySelector('#email')
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
        const email = this.email.value
        const password = this.password.value

        if (username && email && password)
        {
            AuthService
                .signup(username, email, password)
                .then((response) =>
                {
                    // [TODO] Success

                    console.log('[DEBUG] signup success -')
                    console.log(response.data)
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

window.customElements.define('mou-signup', MOUsignup)

export default MOUsignup