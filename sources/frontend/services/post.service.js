import axios from 'axios'

class PostService
{
    postApiPost(formData)
    {
        return axios
            .post('/api/post', formData,
                {
                    headers:
                    {
                        'accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                })
    }

    getApiPost()
    {
        return axios
            .get('/api/post')
    }

    getApiPostId(id)
    {
        return axios
            .get(`/api/post/${id}`)
    }

    deleteApiPost(id)
    {
        return axios
            .delete(`/api/post/${id}`)
    }

    putApiPostId(id, formData)
    {
        return axios
            .put(`/api/post/${id}`, formData,
            {
                headers:
                {
                    'accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            })
    }
}

export default new PostService()