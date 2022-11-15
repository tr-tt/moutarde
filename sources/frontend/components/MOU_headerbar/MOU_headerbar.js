import template from 'raw-loader!./MOU_headerbar.html'

class MOUheaderbar extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: "open"})

        this.shadowRoot.innerHTML = template
    }

    connectedCallback()
    {

    }

    disconnectedCallback()
    {

    }
}

window.customElements.define('mou-headerbar', MOUheaderbar)

export default MOUheaderbar