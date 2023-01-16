import './contact.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_contact/MOU_contact'
import AuthService from '../../services/auth.service'
import UserService from '../../services/user.service'
import SchoolService from '../../services/school.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')
const _logout = document.querySelector('#logout')
const _page = document.querySelector('#page')

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
// Retrieves the user's school and the school
// contacts then populate the page
//===============================================*/

UserService
    .getApiUser()
    .then((response) =>
    {
        if(response.data
            && response.data.message
            && response.data.message.School)
        {
            const school = response.data.message.School.name || ''

            if(school)
            {
                SchoolService
                    .getApiSchoolByName(school)
                    .then((response) =>
                    {
                        if(response.data
                            && response.data.message)
                        {
                            const contacts = response.data.message.Contacts || []
    
                            contacts.forEach((contact) =>
                            {
                                const contactElement = document.createElement('mou-contact')
    
                                contactElement.setAttribute('name', contact.name)
                                contactElement.setAttribute('job', contact.job)
                                contactElement.setAttribute('email', contact.email)
    
                                _page.appendChild(contactElement)
                            })
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
            }
            else
            {
                console.error('no user school found')
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