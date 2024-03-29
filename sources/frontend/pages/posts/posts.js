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

/*===============================================//
// Logouts the user and redirects him to the
// index page when _logout button is clicked
//===============================================*/

_logout.addEventListener(
    'click',
    () =>
    {
        AuthService
            .getApiAuthSignout()
            .then(
                () =>
                {
                    window.location.href = '/'
                }
            )
            .catch(
                (exception) =>
                {
                    console.error(exception)
                }
            )
    }
)

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

    posts.forEach(
        (post) =>
        {
            const postElement = document.createElement('mou-post')
            
            postElement.id = post.id

            if(post.when)
            {          
                postElement.setAttribute('when', post.when)
            }

            postElement.images = post.Images

            postElement.setAttribute('situation', post.situation)

            if(post.tool)
            {
                postElement.setAttribute('tool', post.tool)
            }
            
            if(post.description)
            {
                postElement.setAttribute('description', post.description)
            }        
            
            _page.appendChild(postElement)
        }
    )

    _loading.style.display = 'none'
}

PostService
    .getApiPost()
    .then(
        (response) =>
        {
            if(response.data
                && response.data.message)
            {
                createPostsView(response.data.message)
            }
            else
            {
                console.error('response not well formated')
            }
        }
    )
    .catch(
        (exception) =>
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
        }
    )


