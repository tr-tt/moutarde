const dotenv = require('dotenv')
const express = require('express')
const http = require('http')
const path = require('path')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const fileUpload = require('express-fileupload')

dotenv.config({
    path: path.resolve(`.env.${process.env.NODE_ENV}`)
})

const app = express()
const server = http.createServer(app)
const APP_PORT = process.env.APP_PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(favicon(path.resolve('sources', 'backend', 'public', 'images', 'favicon.ico')))
app.use(fileUpload())

// DATABASE
const db = require('./postgres')
const SchoolTable = require('./tables/school.table')
const ContactTable = require('./tables/contact.table.js')

const populate = async () =>
{
    const schoolCount = await SchoolTable.count()
    const contactCount = await ContactTable.count()
   
    if(schoolCount === 0 && contactCount === 0)
    {
        const transactionInstance = await db.sequelize.transaction()

        try
        {
            const aptParis = await SchoolTable.create({name: 'APT - Paris'}, transactionInstance)
            const bsaBordeaux = await SchoolTable.create({name: 'BSA - Bordeaux'}, transactionInstance)
            const ensiacet = await SchoolTable.create({name: 'ENSIACET - Toulouse'}, transactionInstance)
            const envt = await SchoolTable.create({name: 'ENVT - Toulouse'}, transactionInstance)
            const institutAgroDijon = await SchoolTable.create({name: 'Institut Agro Dijon'}, transactionInstance)
            const institutAgroRennes = await SchoolTable.create({name: 'Institut Agro Rennes'}, transactionInstance)
            const oniris = await SchoolTable.create({name: 'ONIRIS - Nantes'}, transactionInstance)
            const vetAgroSup = await SchoolTable.create({name: 'Vetagrosup - Clermont'}, transactionInstance)
            const autre = await SchoolTable.create({name: 'Autre'}, transactionInstance)

            const emelineAh = await ContactTable.create({name: 'Emeline Ah-Tchine', job: 'Ingénieure de recherche', email: 'emeline.ah-tchine@agrosupdijon.fr'}, transactionInstance)
            const samanthaPagliaro = await ContactTable.create({name: 'Samantha Pagliaro', job: 'Contact Agro Paris Tech', email: 'samantha.pagliaro@agroparistech.fr'}, transactionInstance)
            const nathalieVentola = await ContactTable.create({name: 'Nathalie Ventola', job: 'Contact Bordeaux Sup Agro', email: 'nathalie.ventola@agro-bordeaux.fr'}, transactionInstance)
            const julitteHuez = await ContactTable.create({name: 'Julitte Huez', job: 'Contact ENSIACET', email: 'julitte.huez@ensiacet.fr'}, transactionInstance)
            const ismelineMathet = await ContactTable.create({name: 'Ismeline Mathet', job: 'Contact ENVT', email: 'ismeline.mathet@envt.fr'}, transactionInstance)
            const anaisLoizon = await ContactTable.create({name: 'Anaïs Loizon', job: 'Contact Institut Agro Dijon', email: 'anais.loizon@agrosupdijon.fr'}, transactionInstance)
            const celineMartel = await ContactTable.create({name: 'Céline Martel', job: 'Contact Institut Agro Rennes', email: 'celine.martel@agrocampus-ouest.fr'}, transactionInstance)
            const juliaPoirier = await ContactTable.create({name: 'Julia Poirier', job: 'Contact ONIRIS', email: 'julia.poirier@oniris-nantes.fr'}, transactionInstance)
            const yvesMonlien = await ContactTable.create({name: 'Yves Monlien', job: 'Contact VetagroSup', email: 'yves.monlien@vetagro-sup.fr'}, transactionInstance)
            
            await aptParis.addContact([emelineAh, samanthaPagliaro], {transaction: transactionInstance})
            await bsaBordeaux.addContact([emelineAh, nathalieVentola], {transaction: transactionInstance})
            await ensiacet.addContact([emelineAh, julitteHuez], {transaction: transactionInstance})
            await envt.addContact([emelineAh, ismelineMathet], {transaction: transactionInstance})
            await institutAgroDijon.addContact([emelineAh, anaisLoizon], {transaction: transactionInstance})
            await institutAgroRennes.addContact([emelineAh, celineMartel], {transaction: transactionInstance})
            await oniris.addContact([emelineAh, juliaPoirier], {transaction: transactionInstance})
            await vetAgroSup.addContact([emelineAh, yvesMonlien], {transaction: transactionInstance})
            await autre.addContact([emelineAh, anaisLoizon], {transaction: transactionInstance})

            await transactionInstance.commit()
        }
        catch(exception)
        {
            console.error(`[ERROR] When populating the database ${exception.message}`)

            await transactionInstance.rollback()
        }
    }
}

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
        console.debug(`[DEBUG] change detected on >>> ${path} <<<`)

        webpackHotMiddleware.publish({action: 'reload'})
    })

    app.use(webpackDevMiddleware)
    app.use(webpackHotMiddleware)

    /*db.sequelize
        .sync({force: true})
        .then(() =>
        {
            console.log('[DEBUG] Drop and re-sync database')
        })*/
    db.sequelize
        .sync()
        .then(() =>
        {
            populate()
        })
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
require('./routes/post.routes')(app)
require('./routes/page.routes')(app)
require('./routes/school.routes')(app)

server.listen(APP_PORT, () => 
{
    console.log(`[INFO] Server is running at http://${server.address().address}:${server.address().port}`)
})