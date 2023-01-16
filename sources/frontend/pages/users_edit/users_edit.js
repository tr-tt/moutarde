import './users_edit.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_input_inline/MOU_input_inline'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_select/MOU_select'
import UserService from '../../services/user.service'
import AuthService from '../../services/auth.service'
import SchoolService from '../../services/school.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')
const _logout = document.querySelector('#logout')
const _gotoChart = document.querySelector('#goto__chart')
const _subtitle = document.querySelector('#subtitle')
const _profileFields = document.querySelector('#profile__fields')
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
const _delete = document.querySelector('#delete')
const _posts = document.querySelector('#posts')
const _button = document.querySelector('#button')
const _popup = document.querySelector('#popup')
const _cancel = document.querySelector('#cancel')
const _confirm = document.querySelector('#confirm')

let _current_username = ''
let _current_email = ''
let _userId = 0
let _buttonReady = true
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

/*===============================================//
// Open the chart in a new tab
//===============================================*/

_gotoChart.addEventListener('click', () =>
{
    window.open('/chart', '_blank')
})

/*===============================================//
// Retrieves all schools stored in database and
// populate the school select then populate 
// _birthday and finaly retrieves the user data
// from database
//===============================================*/

SchoolService
    .getApiSchool()
    .then((response) =>
    {
        // SCHOOLS
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

        // BIRTHDAY
        const startYear = 1930
        const endYear = new Date().getFullYear()

        for(let i = endYear; i > startYear; i--)
        {
            const _option = document.createElement('option')

            _option.value = i
            _option.textContent = i

            _birthday.appendChild(_option)
        }

        // USER DATA
        UserService
            .getApiUser()
            .then((response) =>
            {
                if(response.data
                    && response.data.message)
                {
                    console.log(response.data.message);
                    _current_username = response.data.message.username || ''
                    _current_email = response.data.message.email || ''
    
                    _userId = response.data.message.id || 0
                    _job.value = response.data.message.job
                    _username.value = _current_username
                    _email.value = _current_email
                    _lastname.value = response.data.message.lastname || ''
                    _firstname.value = response.data.message.firstname || ''
                    _birthday.value = response.data.message.birthday || ''
                    _sex.value = response.data.message.sex || ''
                    _schoolYear.value = response.data.message.schoolYear || ''
                    _seniority.value = response.data.message.seniority || ''

                    if(response.data.message.School)
                    {
                        _school.value = response.data.message.School.name || ''
                    }
    
                    if(_job.value === 'Etudiant')
                    {
                        _seniority.style.display = 'none'
                    }
                    else if(_job.value === 'Enseignant')
                    {
                        _schoolYear.style.display = 'none'
                    }
                    else
                    {
                        console.error(`[ERROR] job ${_job.value} not supported`)
                    }                    
                }
                else
                {
                    console.error('response not well formated')
                }

                _loading.style.display = 'none'
            })
            .catch((exception) =>
            {
                console.error(exception)
            })

        _loading.style.display = 'none'
    })
    .catch((exception) =>
    {
        console.error(exception)
    })

/*===============================================//
// Opens the delete popup when _delete button
// is clicked
//===============================================*/

_delete.addEventListener('click', () =>
{
    _popup.style.display = 'flex'
})

/*===============================================//
// Closes the delete popup when _cancel button
// is clicked
//===============================================*/

_cancel.addEventListener('click', () =>
{
    _popup.style.display = 'none'
})

/*===============================================//
// Deletes the user accound in database then
// logout the user and redirects him to the
// index page
//===============================================*/

_confirm.addEventListener('click', () =>
{
    UserService
        .deleteApiUserId(_userId)
        .then(() =>
        {
            AuthService
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
                _subtitle.textContent = exception.response.data.message
            }
            else
            {
                console.error(exception)
            }
        })
})

/*===============================================//
// Logouts the user and redirects him to the
// index page when _logout button is clicked
//===============================================*/

_logout.addEventListener('click', () =>
{
    AuthService
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

/*===============================================//
// Tries to send the user updated data to
// database when _button is clicked
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

    _profileFields.innerHTML = ''

    _button.style.display = 'none'

    _posts.setAttribute('label', 'Mon carnet')
    _posts.setAttribute('css', 'colored')
    _posts.setAttribute('title', 'Voir mon carnet')

    _popup.style.display = 'none'

    window.scrollTo(0, 0)
}

const buildFormAndSend = () =>
{
    const formData = new FormData()

    const job = _job.value
    let username = _username.value
    let email = _email.value
    const lastname = _lastname.value
    const firstname = _firstname.value
    const birthday = _birthday.value
    const sex = _sex.value
    const school = _school.value
    const schoolYear = _schoolYear.value
    const seniority = _seniority.value

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
        if(username !== _current_username)
        {
            formData.append('username', username)
        }        
    }
    else
    {
        return error(`Le champ "Nom d'utilisateur" est requis, il doit être unique.`)
    }

    if(email)
    {
        if(email !== _current_email)
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

    UserService
        .putApiUser(formData)
        .then(() =>
        {
            ok(`Votre profil a été mis à jour.`)
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

                error(`Une erreur est survenue`)
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


