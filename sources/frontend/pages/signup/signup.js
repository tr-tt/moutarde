import './signup.css'
import '../../components/MOU_input/MOU_input'
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
const _loading = document.querySelector('#loading')

/*===============================================//
// Retrieves all schools stored in database and
// populate the school select
//===============================================*/

SchoolService
    .getApiSchool()
    .then((response) =>
    {
        console.log(response.data.message);
        const schools = response.data.message || []

        schools.forEach((school) =>
        {
            const _option = document.createElement('option')

            _option.value = school.name
            _option.textContent = school.name

            _school.appendChild(_option)
        })
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

_button.addEventListener('click', () =>
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
        _subtitle.textContent = `Le champ "Fonction" est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(username)
    {
        formData.append('username', username)
    }
    else
    {
        _subtitle.textContent = `Le champ "Nom d'utilisateur" est requis, il doit être unique.`
        _subtitle.classList.add('error')

        return
    }

    if(email)
    {
        formData.append('email', email)
    }
    else
    {
        _subtitle.textContent = `Le champ "Addresse email" est requis, il doit être unique et valide.`
        _subtitle.classList.add('error')

        return
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
        _subtitle.textContent = `Le champ "Etablissement scolaire" est requis.`
        _subtitle.classList.add('error')

        return
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
        console.error(`Unknown ${job}`)

        return
    }

    if(password)
    {
        formData.append('password', password)
    }
    else
    {
        _subtitle.textContent = `Le champ "Mot de passe" est requis, il doit être non vide.`
        _subtitle.classList.add('error')

        return
    }

    if(confirmPassword)
    {
        formData.append('confirmPassword', confirmPassword)
    }
    else
    {
        _subtitle.textContent = `Le champ "Confirmation du mot de passe" est requis, il doit être identique au mot de passe.`
        _subtitle.classList.add('error')

        return
    }

    if(password !== confirmPassword)
    {
        _subtitle.textContent = `Attention, votre mot de passe est différent du mot de passe de confirmation.`
        _subtitle.classList.add('error')

        return
    }

    if(!_chart.checked)
    {
        _subtitle.textContent = `Vous devez avoir lu et accepter la charte du consentement éclairé avant de pouvoir créer un compte.`
        _subtitle.classList.add('error')

        return
    }

    UserService
        .postApiUser(formData)
        .then(() =>
        {
            _subtitle.textContent = `Votre compte a été crée, vous pouvez dès à présent vous connecter.`
            _subtitle.classList.remove('error')

            _signupFields.innerHTML = ''
            _button.style.display = 'none'
            _signin.setAttribute('css', 'colored')
        })
        .catch((exception) =>
        {
            if(exception.response
                && exception.response.data
                && exception.response.data.message)
            {
                _subtitle.textContent = exception.response.data.message
                _subtitle.classList.add('error')
            }
            else
            {
                console.error(exception)
            }
        })
})

/*===============================================//
// Removes the loading screen when everything
// is loaded
//===============================================*/

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})