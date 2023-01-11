import './signup.css'
import '../../components/MOU_input_inline/MOU_input_inline'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_select/MOU_select'
import '../../components/MOU_headerbar/MOU_headerbar'
import UserService from '../../services/user.service'
import SchoolService from '../../services/school.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _subtitle = document.querySelector('#subtitle')
const _signupFields = document.querySelector('#signup__fields')
const _job = document.querySelector('#job')
const _username = document.querySelector('#username')
const _email = document.querySelector('#email')
const _lastname = document.querySelector('#lastname')
const _firstname = document.querySelector('#firstname')
const _birthday = document.querySelector('#birthday')
const _sex = document.querySelector('#sex')
const _school = document.querySelector('#school')
const _schoolYear = document.querySelector('#school__year')
const _seniority = document.querySelector('#seniority')
const _password = document.querySelector('#password')
const _confirmPassword = document.querySelector('#confirm__password')
const _show = document.querySelector('#show')
const _chart = document.querySelector('#chart')
const _gotoChart = document.querySelector('#goto__chart')
const _signin = document.querySelector('#signin')
const _button = document.querySelector('#button')
const _popup = document.querySelector('#popup')
const _loading = document.querySelector('#loading')

let _buttonReady = true
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

/*===============================================//
// Retrieves all schools stored in database and
// populate the school select
//===============================================*/

SchoolService
    .getApiSchool()
    .then((response) =>
    {
        if(response.data
            && response.data.message)
        {
            const schools = response.data.message || []

            schools.forEach((school) =>
            {
                const _option = document.createElement('option')
    
                _option.value = school.name
                _option.textContent = school.name
    
                _school.appendChild(_option)
            })
        }
        else
        {
            console.error('response not well formated')
        }
    })
    .catch((exception) =>
    {
        console.error(exception);
    })

/*===============================================//
// Populate _birthday
//===============================================*/

const startYear = 1930
const endYear = new Date().getFullYear()

for(let i = endYear; i > startYear; i--)
{
    const _option = document.createElement('option')

    _option.value = i
    _option.textContent = i

    _birthday.appendChild(_option)
}


/*===============================================//
// Adapt the form if "Etudiant" or "Enseignant"
// is selected
//===============================================*/

_seniority.style.display = 'none'

_job.addEventListener('mou-select:change', (event) =>
{
    if(event.detail.value === 'Etudiant')
    {
        _schoolYear.style.display = 'block'
        _seniority.style.display = 'none'
    }
    else if(event.detail.value === 'Enseignant')
    {
        _schoolYear.style.display = 'none'
        _seniority.style.display = 'block'
    }
    else
    {
        console.error(`[ERROR] job ${event.detail.value} not supported`)
    }
})

/*===============================================//
// Open the chart in a new tab
//===============================================*/

_gotoChart.addEventListener('click', () =>
{
    window.open('/chart', '_blank')
})

/*===============================================//
// Hides or shows the password when the _show
// checkbox is triggered
//===============================================*/

_show.addEventListener('click', () =>
{
    if(_password.getAttribute('type') === 'password')
    {
        _password.setAttribute('type', 'text')
    }
    else
    {
        _password.setAttribute('type', 'password')
    }
})

/*===============================================//
// Tries to submit the form when the _button is
// clicked
//===============================================*/

const error = (message) =>
{
    _subtitle.textContent = message
    _subtitle.classList.add('error')

    _button.setAttribute('css', 'error')
    _buttonReady = true

    _popup.style.display = 'none'
    
    window.scrollTo(0, 0)
}

const ok = (message) =>
{
    _subtitle.textContent = message
    _subtitle.classList.remove('error')

    _signupFields.innerHTML = ''

    _button.style.display = 'none'

    _signin.setAttribute('css', 'colored')

    _popup.style.display = 'none'

    window.scrollTo(0, 0)
}

const buildFormAndSend = () =>
{
    const formData = new FormData()

    const job = _job.value
    const username = _username.value
    const lastname = _lastname.value
    const firstname = _firstname.value
    const email = _email.value
    const birthday = _birthday.value
    const sex = _sex.value
    const school = _school.value
    const schoolYear = _schoolYear.value
    const seniority = _seniority.value
    const password = _password.value
    const confirmPassword = _confirmPassword.value

    if(job)
    {
        formData.append('job', job)
    }
    else
    {
        return error(`Le champ "Fonction" est requis.`)
    }

    if(username)
    {
        formData.append('username', username)
    }
    else
    {
        return error(`Le champ "Nom d'utilisateur" est requis, il doit être unique.`)
    }

    if(email)
    {
        if(emailRegex.test(email))
        {
            formData.append('email', email)
        }
        else
        {
            return error(`Le champ "Adresse email" est invalide.`)
        }
    }
    else
    {
        return error(`Le champ "Adresse email" est requis, il doit être unique et valide.`)
    }

    if(lastname)
    {
        formData.append('lastname', lastname)
    }

    if(firstname)
    {
        formData.append('firstname', firstname)
    }

    if(birthday)
    {
        formData.append('birthday', birthday)
    }

    if(sex)
    {
        formData.append('sex', sex)
    }

    if(school)
    {
        formData.append('school', school)
    }
    else
    {
        return error(`Le champ "Etablissement scolaire" est requis.`)
    }

    if(job === 'Etudiant')
    {
        if(schoolYear)
        {
            formData.append('schoolYear', schoolYear)
        }
    }
    else if(job === 'Enseignant')
    {
        if(seniority)
        {
            formData.append('seniority', seniority)
        }
    }
    else
    {
        return error(`Le champ "Fonction" ${job} est inconnu.`)
    }

    if(password)
    {
        formData.append('password', password)
    }
    else
    {
        return error(`Le champ "Mot de passe" est requis, il doit être non vide.`)
    }

    if(confirmPassword)
    {
        formData.append('confirmPassword', confirmPassword)
    }
    else
    {
        return error(`Le champ "Confirmation du mot de passe" est requis, il doit être identique au mot de passe.`)
    }

    if(password !== confirmPassword)
    {
        return error(`Attention, votre mot de passe est différent du mot de passe de confirmation.`)
    }

    if(!_chart.checked)
    {
        return error(`Vous devez avoir lu et accepter la charte du consentement éclairé avant de pouvoir créer un compte.`)
    }

    _popup.style.display = 'flex'

    UserService
        .postApiUser(formData)
        .then(() =>
        {
            ok(`Votre compte a été crée, vous pouvez dès à présent vous connecter.`)
        })
        .catch((exception) =>
        {
            if(exception.response
                && exception.response.data
                && exception.response.data.message)
            {
                error(exception.response.data.message)
            }
            else
            {
                console.error(exception)

                error(`Une erreur est survenue.`)
            }
        })
}

_button.addEventListener('click', () =>
{
    if(_buttonReady)
    {
        _buttonReady = false

        buildFormAndSend()
    }
})

/*===============================================//
// Removes the loading screen when everything
// is loaded
//===============================================*/

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})