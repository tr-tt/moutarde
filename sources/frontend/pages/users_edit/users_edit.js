import './users_edit.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_input/MOU_input'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_select/MOU_select'
import userService from '../../services/user.service'
import authService from '../../services/auth.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')

const _logout = document.querySelector('#logout')

const _subtitle = document.querySelector('#subtitle')
const _profileFields = document.querySelector('#profile__fields')

const _job = document.querySelector('#job')
const _username = document.querySelector('#username')
const _email = document.querySelector('#email')
const _birthday = document.querySelector('#birthday')
const _sex = document.querySelector('#sex')

const _school = document.querySelector('#school')
const _schoolYear = document.querySelector('#school__year')
const _seniority = document.querySelector('#seniority')

const _delete = document.querySelector('#delete')

const _posts = document.querySelector('#posts')
const _button = document.querySelector('#button')

const _popup = document.querySelector('#popup')
const _popupSubtitle = document.querySelector('#popup__subtitle')

const _cancel = document.querySelector('#cancel')
const _confirm = document.querySelector('#confirm')

let _current_username = ''
let _current_email = ''
let _userId = 0

_delete.addEventListener('click', () =>
{
    _popup.style.display = 'flex'
})

_cancel.addEventListener('click', () =>
{
    _popup.style.display = 'none'
})

_confirm.addEventListener('click', () =>
{
    userService
        .deleteApiUserId(_userId)
        .then(() =>
        {
            authService
                .getApiAuthSignout()
                .then(() =>
                {
                    window.location.href = '/'
                })
                .catch((exception) =>
                {
                    console.error(exception)
                })
        })
        .catch((exception) =>
        {
            if(exception.response
                && exception.response.data
                && exception.response.data.message)
            {
                _popupSubtitle.textContent = exception.response.data.message
                _popupSubtitle.classList.add('error')
            }
            else
            {
                console.error(exception)
            }
        })
})

_logout.addEventListener('click', () =>
{
    authService
        .getApiAuthSignout()
        .then(() =>
        {
            window.location.href = '/'
        })
        .catch((exception) =>
        {
            console.error(exception)
        })
})

userService
    .getApiUser()
    .then((response) =>
    {
        _current_username = response.data.message.username || ''
        _current_email = response.data.message.email || ''

        _userId = response.data.message.id || 0
        _job.value = response.data.message.job
        _username.value = _current_username
        _email.value = _current_email
        _birthday.value = response.data.message.birthday || null
        _sex.value = response.data.message.sex || ''
        _school.value = response.data.message.school || ''
        _schoolYear.value = response.data.message.schoolYear || ''
        _seniority.value = response.data.message.seniority || 0

        if(_job.value === 'Etudiant')
        {
            _seniority.style.display = 'none'
        }
        else if(_job.value === 'Professeur')
        {
            _schoolYear.style.display = 'none'
        }
        else
        {
            console.error(`[ERROR] job ${_job.value} not supported`)
        }

        _loading.style.display = 'none'
    })
    .catch((exception) =>
    {
        console.error(exception)
    })

_button.addEventListener('click', () =>
{
    const formData = new FormData()

    const job = _job.value
    let username = _username.value
    let email = _email.value
    const birthday = _birthday.value
    const sex = _sex.value
    const school = _school.value

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
        if(username !== _current_username)
        {
            formData.append('username', username)
        }        
    }
    else
    {
        _subtitle.textContent = `Un nom d'utilisateur unique est requis.`
        _subtitle.classList.add('error')

        return
    }

    if(email)
    {
        if(email !== _current_email)
        {
            formData.append('email', email)
        }
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

    userService
        .putApiUser(formData)
        .then((response) =>
        {
            _subtitle.textContent = response.data.message
            _subtitle.classList.remove('error')

            _profileFields.innerHTML = ''
            _button.style.display = 'none'
            _posts.setAttribute('label', 'Mes formulaires')
            _posts.setAttribute('css', 'colored')
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


