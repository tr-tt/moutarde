import AuthService from '../../services/auth.service'
import template from 'raw-loader!./MOU_signup.html'

class MOUsignup extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template

        this._button = this.shadowRoot.querySelector('#button')
        this._username = this.shadowRoot.querySelector('#username')
        this._email = this.shadowRoot.querySelector('#email')
        this._password = this.shadowRoot.querySelector('#password')
        this._subtitle = this.shadowRoot.querySelector('#subtitle')
        this._form = this.shadowRoot.querySelector('form')
        this._signin = this.shadowRoot.querySelector('#signin')

        this._signin.style.display = 'none'
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
        const email = this._email.value
        const password = this._password.value

        if (username && email && password)
        {
            AuthService
                .postApiUsers(username, email, password)
                .then(() =>
                {
                    this._subtitle.textContent = `Votre compte a été crée, vous pouvez dès à présent vous connecter en cliquant sur le bouton ci dessus`
                    this._subtitle.classList.add('success')
                    this._form.style.display = 'none'
                    this._signin.style.display = 'block'
                })
                .catch((exception) =>
                {
                    this._subtitle.textContent = exception.response.data.message
                    this._subtitle.classList.add('error')
                })
        }
    }
}

window.customElements.define('mou-signup', MOUsignup)

export default MOUsignup