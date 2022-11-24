import template from 'raw-loader!./MOU_copyright.html'

class MOUcopyright extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template
    }
}

window.customElements.define('mou-copyright', MOUcopyright)

export default MOUcopyright