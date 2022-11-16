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
        this._username__error = this.shadowRoot.querySelector('#username__error')
        this._email__error = this.shadowRoot.querySelector('#email__error')
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
        this._email__error.textContent = ''
        this._email__error.style.opacity = 0
        this._password__error.textContent = ''
        this._password__error.style.opacity = 0

        const username = this._username.value
        const email = this._email.value
        const password = this._password.value

        if (username && email && password)
        {
            AuthService
                .signup(username, email, password)
                .then((response) =>
                {
                    window.location.replace('signin') // Redirect to login page with no ability to return back.
                })
                .catch((exception) =>
                {
                    const code = exception.response.data.code || 0

                    switch(code)
                    {
                        case 3:
                            this._username__error.textContent = `Ce nom d'utilisateur est déjà utilisé`
                            this._username__error.style.opacity = 1
                            break;
                        case 4:
                            this._email__error.textContent = 'Cette adresse email est déjà utilisée'
                            this._email__error.style.opacity = 1
                            break;
                        case 5:
                            console.log(`[ERROR] Internal server error code ${code}`)
                            break;
                        default:
                            console.log(`[ERROR] Unknown error code ${code}`)
                    }
                })
        }
    }
}

window.customElements.define('mou-signup', MOUsignup)

export default MOUsignup