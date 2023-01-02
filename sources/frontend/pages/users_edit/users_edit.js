import './users_edit.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_input/MOU_input'
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
const _popupSubtitle = document.querySelector('#popup__subtitle')
const _cancel = document.querySelector('#cancel')
const _confirm = document.querySelector('#confirm')

let _current_username = ''
let _current_email = ''
let _userId = 0

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
        const schools = response.data.message || []

        schools.forEach((school) =>
        {
            const _option = document.createElement('option')

            _option.value = school.name
            _option.textContent = school.name

            _school.appendChild(_option)
        })

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
                _school.value = response.data.message.school || ''
                _schoolYear.value = response.data.message.schoolYear || ''
                _seniority.value = response.data.message.seniority || ''

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

                _loading.style.display = 'none'
            })
            .catch((exception) =>
            {
                console.error(exception)
            })
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
                _popupSubtitle.textContent = exception.response.data.message
                _popupSubtitle.classList.add('error')
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

_button.addEventListener('click', () =>
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
        _subtitle.textContent = `Le champ "Fonction" est requis.`
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
        _subtitle.textContent = `Le champ "Nom d'utilisateur" est requis, il doit être unique.`
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

    UserService
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


