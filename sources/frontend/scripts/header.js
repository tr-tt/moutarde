(
    () =>
    {
        const webpackHotMiddlewareClient = require('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true')

        webpackHotMiddlewareClient.subscribe(
            (payload) =>
            {
                if(payload.action === 'reload' || payload.reload === true)
                {
                    window.location.reload()
                }
            }
        )

        module.exports = webpackHotMiddlewareClient
    }
)()