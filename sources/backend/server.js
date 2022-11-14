const express = require('express')
const http = require('http')
const path = require('path')

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({extended: true}))


if(process.env.NODE_ENV === 'development')
{
    const webpack = require('webpack')
    const chokidar = require('chokidar')

    const webpackConfig = require(path.resolve('setups', 'webpack.dev.js'))
    const compiler = webpack(webpackConfig)
    const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {publicPath: webpackConfig.output.publicPath, writeToDisk: true})
    const webpackHotMiddleware = require('webpack-hot-middleware')(compiler, {log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000})
    const htmlFiles = `${path.resolve('sources', 'frontend')}/**/*.html`
    const watcher = chokidar.watch(htmlFiles)

    watcher.on('ready', () =>
    {
        console.debug('[DEBUG] watcher ready')
    })

    watcher.on('change', (path) => 
    {
        console.debug(`[DEBUG] change detected on *** ${path} ***`)

        webpackHotMiddleware.publish({action: 'reload'})
    })

    app.use(webpackDevMiddleware)
    app.use(webpackHotMiddleware)
}
else
{
    app.use(express.static(path.resolve('_build')))
}

app.get('/index', (request, response) =>
{
    response.sendFile(path.resolve('_build', 'index.html'))
})

app.get('/services', (request, response) =>
{
    response.sendFile(path.resolve('_build', 'services.html'))
})

server.listen(8000, () => 
{
    console.log('Server starting at http://localhost:8000')
})