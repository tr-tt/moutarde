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

// DATABASE
const db = require('./postgres')

if(process.env.NODE_ENV === 'development')
{
    const webpack = require('webpack')
    const chokidar = require('chokidar')

    const webpackConfig = require(path.resolve('setups', 'webpack.dev.js'))
    const compiler = webpack(webpackConfig)
    const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {publicPath: webpackConfig.output.publicPath, writeToDisk: true})
    const webpackHotMiddleware = require('webpack-hot-middleware')(compiler, {log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000})
    const sourcesFiles = `${path.resolve('sources', 'frontend')}/**/*`
    const rootCssFile = path.resolve('sources', 'backend', 'public', 'css', 'root.css')
    const watcher = chokidar.watch([
        sourcesFiles,
        rootCssFile
    ])

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

    //db.sequelize.sync({force: true})
    db.sequelize.sync()
}
else
{
    app.use(express.static(path.resolve('_build')))

    db.sequelize.sync()
}

// PUBLIC FILES (like images)
app.use('/static', express.static(path.resolve('sources', 'backend', 'public')))

// ROUTES
require('./routes/auth.routes')(app)
require('./routes/user.routes')(app)

server.listen(APP_PORT, '127.0.0.1', () => 
{
    console.log(`[INFO] Server is running at http://${server.address().address}:${server.address().port}`)
})