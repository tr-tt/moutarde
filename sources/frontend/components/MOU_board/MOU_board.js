import template from 'raw-loader!./MOU_board.html'

class MOUboard extends HTMLElement
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

window.customElements.define('mou-board', MOUboard)

export default MOUboard