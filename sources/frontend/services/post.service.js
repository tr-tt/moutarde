import axios from 'axios'

class PostService
{
    postApiPost(formData, _popupProgress)
    {
        return axios
            .post(
                '/api/post',
                formData,
                {
                    headers:
                    {
                        'accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress:
                    (event) =>
                    {
                        const progress = Math.round((event.loaded * 100) / event.total)

                        _popupProgress.textContent = `${progress}%`
                    }
                }
            )
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

    putApiPostId(id, formData, _popupProgress)
    {
        return axios
            .put(
                `/api/post/${id}`,
                formData,
                {
                    headers:
                    {
                        'accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress:
                    (event) =>
                    {
                        const progress = Math.round((event.loaded * 100) / event.total)

                        _popupProgress.textContent = `${progress}%`
                    }
                }
            )
    }

    getApiPdfPost()
    {
        return fetch(
            `/api/pdf/post`,
            {
                method: 'GET'
            }
        )
    }
}

export default new PostService()