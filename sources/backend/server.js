const dotenv = require('dotenv')
const express = require('express')
const http = require('http')
const path = require('path')

dotenv.config({
    path: path.resolve(`.env.${process.env.NODE_ENV}`)
})

const app = express()
const server = http.createServer(app)
const APP_PORT = process.env.APP_PORT || 5000

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
    const sourcesFiles = `${path.resolve('sources', 'frontend')}/**/*`
    const watcher = chokidar.watch(sourcesFiles)

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

// DATABASE
const db = require('./postgres')

db.sequelize.sync()

// ROUTES
require('./routes/auth.routes')(app)

app.get('/', (request, response) =>
{
    response.sendFile(path.resolve('_build', 'index.html'))
})

app.get('/services', (request, response) =>
{
    response.sendFile(path.resolve('_build', 'services.html'))
})

server.listen(APP_PORT, '127.0.0.1', () => 
{
    console.log(`[INFO] Server is running at http://${server.address().address}:${server.address().port}`)
})