import './signup.css'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_select/MOU_select'
import '../../components/MOU_headerbar/MOU_headerbar'
import UserService from '../../services/user.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _subtitle = document.querySelector('#subtitle')
const _signupFields = document.querySelector('#signup__fields')

const _job = document.querySelector('#job')
const _username = document.querySelector('#username')
const _email = document.querySelector('#email')
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

_seniority.style.display = 'none'

_job.addEventListener('mou-select:change', (event) =>
{
    if(event.detail.value === 'Etudiant')
    {
        _schoolYear.style.display = 'block'
        _seniority.style.display = 'none'
    }
    else if(event.detail.value === 'Professeur')
    {
        _schoolYear.style.display = 'none'
        _seniority.style.display = 'block'
    }
    else
    {
        console.error(`[ERROR] job ${event.detail.value} not supported`)
    }
})

_gotoChart.addEventListener('click', () =>
{
    window.open('/chart', '_blank')
})

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

_button.addEventListener('click', () =>
{
    const formData = new FormData()

    const job = _job.value
    const username = _username.value
    const email = _email.value
    const birthday = _birthday.value
    const sex = _sex.value
    const school = _school.value
    const password = _password.value
    const confirmPassword = _confirmPassword.value

    if(job)
    {
        formData.append('job', job)
    }
    else
    {
        _subtitle.textContent = `Une fonction est requise.`
        _subtitle.classList.add('error')

        return
    }

    if(username)
    {
        formData.append('username', username)
    }
    else
    {
        _subtitle.textContent = `Un nom d'utilisateur unique est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(email)
    {
        formData.append('email', email)
    }
    else
    {
        _subtitle.textContent = `Une addresse email unique et valide est requise.`
        _subtitle.classList.add('error')

        return
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
        _subtitle.textContent = `Un nom d'établissement scolaire est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(job === 'Etudiant')
    {
        const schoolYear = _schoolYear.value

        if(schoolYear)
        {
            formData.append('schoolYear', schoolYear)
        }
        else
        {
            _subtitle.textContent = `Une année scolaire est requise.`
            _subtitle.classList.add('error')

            return
        }
    }
    else if(job === 'Professeur')
    {
        const seniority = _seniority.value

        if(seniority)
        {
            formData.append('seniority', seniority)
        }
        else
        {
            _subtitle.textContent = `Une ancienneté en année(s) est requise.`
            _subtitle.classList.add('error')

            return
        }
    }
    else
    {
        _subtitle.textContent = `La profession ${job} n'est pas supportée.`
        _subtitle.classList.add('error')

        return
    }

    if(password)
    {
        formData.append('password', password)
    }
    else
    {
        _subtitle.textContent = `Un mot de passe non vide est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(confirmPassword)
    {
        formData.append('confirmPassword', confirmPassword)
    }
    else
    {
        _subtitle.textContent = `Le mot de passe de confirmation identique au mot de passe est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(password !== confirmPassword)
    {
        _subtitle.textContent = `Votre mot de passe est différent du mot de passe de confirmation.`
        _subtitle.classList.add('error')

        return
    }

    if(!_chart.checked)
    {
        _subtitle.textContent = `Vous devez accepter la charte de consentement avant de créer un compte.`
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

window.addEventListener('DOMContentLoaded', () =>
{
    _loading.style.display = 'none'
})