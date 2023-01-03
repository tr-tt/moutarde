import './posts.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_post/MOU_post'
import PostService from '../../services/post.service'
import AuthService from '../../services/auth.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _loading = document.querySelector('#loading')
const _logout = document.querySelector('#logout')
const _page = document.querySelector('#page')
const _empty = document.querySelector('#empty')

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
// Retrieves all forms stored in database and
// populate the page with
//===============================================*/

const createPostsView = (posts) =>
{
    if(!posts.length)
    {
        _loading.style.display = 'none'

        return
    }

    _empty.classList.add('hide')

    posts.forEach((post) =>
    {
        const postElement = document.createElement('mou-post')
        
        postElement.id = post.id
        postElement.setAttribute('createdAt', post.createdAt)
        postElement.image = post.image
        postElement.setAttribute('title', post.title)
        postElement.setAttribute('tool', post.tool)
        postElement.setAttribute('description', post.description)
        postElement.addEventListener('mou-post:delete', () =>
        {
            if(_page.childElementCount === 1)
            {
                _empty.classList.remove('hide')
            }
        })
        
        _page.appendChild(postElement)
    })

    _loading.style.display = 'none'
}

PostService
    .getApiPost()
    .then((response) =>
    {
        createPostsView(response.data.message)
    })
    .catch((exception) =>
    {
        if(exception.response
            && exception.response.data
            && exception.response.data.message)
        {
            console.log(exception.response.data.message)
        }
        else
        {
            console.error(exception)
        }
    })


