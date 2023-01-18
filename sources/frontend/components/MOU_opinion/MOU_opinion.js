import template from 'raw-loader!./MOU_opinion.html'

class MOUopinion extends HTMLElement
{
    constructor()
    {
        super()

        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML = template

        this._opinionFields = this.shadowRoot.querySelectorAll('.opinion__fields')
    }

    connectedCallback()
    {
        this._opinionFields.forEach(
            (field) =>
            {
                field.addEventListener('click', this._onClickHandler.bind(this))
            }
        )
    }

    disconnectedCallback()
    {

    }

    _onClickHandler(event)
    {
        this._opinionFields.forEach(
            (field) =>
            {
                if(field !== event.target)
                {
                    field.classList.remove('active')
                }
            }
        )

        event.target.classList.toggle('active')
    }

    get value()
    {
        let value = ''
        const field = [...this._opinionFields].find((field) => field.classList.contains('active'))

        if(field)
        {
            value = field.id
        }

        return value
    }

    set value(value)
    {
        if(value && ['Satisfaisant', 'Indécis', 'Insatisfaisant'].includes(value))
        {
            const field = this.shadowRoot.querySelector(`#${value}`)

            if(field)
            {
                field.click()
            }
        }
    }
}

window.customElements.define('mou-opinion', MOUopinion)

export default MOUopinion