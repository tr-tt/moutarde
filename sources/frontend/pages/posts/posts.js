import './posts.css'
import '../../components/MOU_headerbar/MOU_headerbar'
import '../../components/MOU_usermenu/MOU_usermenu'
import '../../components/MOU_link/MOU_link'
import '../../components/MOU_post/MOU_post'
import postService from '../../services/post.service'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

const _page = document.querySelector('#page')
const _empty = document.querySelector('#empty')
const _loading = document.querySelector('#loading')

 
const createPostsView = (posts) =>
{
    if(!posts.length)
    {
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
            if(_page.childElementCount === 2)
            {
                _empty.classList.remove('hide')
            }
        })
        
        _page.appendChild(postElement)
    })
}

postService
    .getApiPost()
    .then((response) =>
    {
        createPostsView(response.data.message)

        _loading.style.display = 'none'
    })
    .catch((exception) =>
    {
        exception.response
            && exception.response.data
            && exception.response.data.message
            && console.log(exception.response.data.message)
    })


