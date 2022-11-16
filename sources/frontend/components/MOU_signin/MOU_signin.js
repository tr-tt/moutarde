import AuthService from '../../services/auth.service'
import UserService from '../../services/user.service'
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
        this._username__error = this.shadowRoot.querySelector('#username__error')
        this._password__error = this.shadowRoot.querySelector('#password__error')
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
        this._username__error.textContent = ''
        this._username__error.style.opacity = 0
        this._password__error.textContent = ''
        this._password__error.style.opacity = 0

        const username = this._username.value
        const password = this._password.value

        if (username && password)
        {
            AuthService
                .signin(username, password)
                .then((response) =>
                {
                    window.location.replace('board')
                })
                .catch((exception) =>
                {
                    const code = exception.response.data.code || 0

                    switch(code)
                    {
                        case 1:
                            this._username__error.textContent = `Cet utilisateur n'est pas enregistré`
                            this._username__error.style.opacity = 1
                            break;
                        case 2:
                            this._password__error.textContent = 'Le mot de passe est incorrect'
                            this._password__error.style.opacity = 1
                            break;
                        default:
                            console.log(`[ERROR] Unknown error code ${code}`)
                    }
                })
        }
    }
}

window.customElements.define('mou-signin', MOUsignin)

export default MOUsignin