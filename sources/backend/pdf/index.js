const PDFDocument = require('pdfkit')
const path = require('path')

const _MARGIN__R = 50
const _MARGIN__L = 50
const _MARGIN__T = 20
const _MARGIN__B = 20
const _TITLE__SIZE = 35
const _ICON__SIZE = 25
const _HEADER__SIZE = 12
const _DATE__SIZE = 14
const _TEXT__SIZE = 10
const _COLOR__1 = '#DD9936'
const _COLOR__BLACK = '#000000'

const addHorizontalRule = (doc, spaceFromEdge = 0, linesAboveAndBelow = 0.5) =>
{
    doc.moveDown(linesAboveAndBelow)
  
    doc.moveTo(0 + spaceFromEdge, doc.y).lineTo(doc.page.width - spaceFromEdge, doc.y).strokeColor(_COLOR__1).stroke()
  
    doc.moveDown(linesAboveAndBelow + 0.4)
    
    return doc
}

const drawHeader = (doc) =>
{
    doc.image(path.resolve('sources', 'backend', 'public', 'images', 'logos', 'logo_hercule.png'), _MARGIN__L, _MARGIN__T,
        {
            fit: [doc.page.width - _MARGIN__L - _MARGIN__R, 300],
            align: 'center'
        }
    )

    doc.moveDown(8)

    doc.fillColor(_COLOR__1)
    doc.fontSize(_TITLE__SIZE)
    doc.text('MON CARNET HERCULE',
        {
            align: 'center'
        }
    )

    doc.moveDown(1)
}

const drawUser = (doc, key, value) =>
{
    doc.fillColor(_COLOR__1)
    doc.fontSize(_DATE__SIZE)
    doc.text(key)

    doc.fillColor(_COLOR__BLACK)
    doc.fontSize(_HEADER__SIZE)
    doc.text(value)

    doc.moveDown(1)
}

const drawPost = (doc, header, content, icon) =>
{
    doc.fillColor(_COLOR__1)
    doc.fontSize(_HEADER__SIZE)
    doc.text(header)

    if(icon)
    {
        doc.image(path.resolve('sources', 'backend', 'public', 'images', 'icons', icon), doc.page.width - _MARGIN__R - _ICON__SIZE, doc.y - _ICON__SIZE,
            {
                fit: [_ICON__SIZE, _ICON__SIZE],
                align: 'right'
            }
        )
    }

    addHorizontalRule(doc, _MARGIN__L, 0.1)

    doc.fillColor(_COLOR__BLACK)
    doc.fontSize(_TEXT__SIZE)
    doc.text(content)

    doc.moveDown(1)
}

const drawPostDate = (doc, date) =>
{
    doc.fillColor(_COLOR__BLACK)
    doc.fontSize(_DATE__SIZE)
    doc.text(date,
        {
            align: 'center'
        }
    )
    doc.moveDown(1)
}

const drawPostPictureHeader = (doc, header, icon) =>
{
    doc.fillColor(_COLOR__1)
    doc.fontSize(_HEADER__SIZE)
    doc.text(header)

    if(icon)
    {
        doc.image(path.resolve('sources', 'backend', 'public', 'images', 'icons', icon), doc.page.width - _MARGIN__R - _ICON__SIZE, doc.y - _ICON__SIZE,
            {
                fit: [_ICON__SIZE, _ICON__SIZE],
                align: 'right'
            }
        )
    }

    addHorizontalRule(doc, _MARGIN__L, 0.1)
}

const drawPostPicture = (doc, imageData, imageX, imageY) =>
{
    const halfWidth = doc.page.width / 2

    doc.image(imageData.blob, imageX, imageY, 
        {
           fit: [halfWidth - _MARGIN__L, 200],
           align: 'center',
           valign: 'center'
        }
    )
    .rect(imageX, imageY, halfWidth - _MARGIN__L, 200)
    .stroke()
}

const drawPostPictureFooter = (doc) =>
{
    doc.moveDown(1)
}

buildPDF = (user, posts, dataCallback, endCallback) =>
{
    const doc = new PDFDocument(
        {
            bufferPages: true,
            autoFirstPage: false,
            size: 'A4',
            margins:
            {
                top: _MARGIN__T,
                left: _MARGIN__L,
                right: _MARGIN__R,
                bottom: _MARGIN__B
            },
            layout: 'portrait',
            info:
            {
                Title: 'Mon carnet hercule'
            }
        }
    )

    doc.on('data', dataCallback)
    doc.on('end', endCallback)

    doc.addPage()

    doc.font(path.resolve('sources', 'backend', 'public', 'fonts', 'Poppins-Regular.ttf'))

    /*===============================================//
    // first page
    //===============================================*/

    drawHeader(doc)

    /*===============================================//
    // school
    //===============================================*/

    drawUser(doc, 'Etablissement scolaire :', user.School.name)

    /*===============================================//
    // job
    //===============================================*/

    drawUser(doc, 'Fonction :', user.job)

    /*===============================================//
    // username
    //===============================================*/

    drawUser(doc, `Nom d'utilisateur :`, user.username)

    /*===============================================//
    // email
    //===============================================*/

    drawUser(doc, `Adresse email :`, user.email)
   
    posts.forEach(
        (post) =>
        {
            doc.addPage()

            /*===============================================//
            // when
            //===============================================*/

            if(post.when)
            {
                const date = new Date(post.when).toLocaleTimeString(['fr-FR'], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})

                drawPostDate(doc, date)
            }

            /*===============================================//
            // situation
            //===============================================*/

            drawPost(doc, 'Situation vécue', post.situation)

            /*===============================================//
            // pictures
            //===============================================*/

            if(
                (
                    post.Images[0]
                    && post.Images[0].dataValues.name
                    && post.Images[0].dataValues.type
                    && post.Images[0].dataValues.blob
                )
                ||
                (
                    post.Images[1]
                    && post.Images[1].dataValues.name
                    && post.Images[1].dataValues.type
                    && post.Images[1].dataValues.blob
                )
            )
            {
                drawPostPictureHeader(doc, 'Mes visuels', '10_appareil_photo.png')

                let imageX = _MARGIN__L
                let imageY = doc.y
    
                if(post.Images[0]
                    && post.Images[0].dataValues.name
                    && post.Images[0].dataValues.type
                    && post.Images[0].dataValues.blob
                )
                {
                    drawPostPicture(doc, post.Images[0].dataValues, imageX, imageY)
    
                    imageX = doc.page.width / 2
                }
    
                if(post.Images[1]
                    && post.Images[1].dataValues.name
                    && post.Images[1].dataValues.type
                    && post.Images[1].dataValues.blob
                )
                {
                    drawPostPicture(doc, post.Images[1].dataValues, imageX, imageY)
                }
    
                drawPostPictureFooter(doc)

                doc.y = imageY + 210 // required because the doc.y is not well computed if the first image is smaller than the fit property.
            }

            /*===============================================//
            // tool
            //===============================================*/

            if(post.tool)
            {
                drawPost(doc, 'Outil cible', post.tool)
            }
            
            /*===============================================//
            // feeling
            //===============================================*/

            if(post.feeling)
            {
                let feeling__icon = ''

                if(post.feeling === 'Satisfaisant')
                {
                    feeling__icon = '1_satisfaisant.png'
                }
                else if(post.feeling === 'Indécis')
                {
                    feeling__icon = '2_indecis.png'
                }
                else if(post.feeling === 'Insatisfaisant')
                {
                    feeling__icon = '3_insatisfaisant.png'
                }

                drawPost(doc, 'Ressenti', post.feeling, feeling__icon)
            }
            

            /*===============================================//
            // description
            //===============================================*/

            if(post.description)
            {
                drawPost(doc, `Ce qu'il s'est passé (personnes impliquées, lieu(x) et déroulement)`, post.description, '4_ce_qu_il_s_est_passe.png')
            }
            
            /*===============================================//
            // ressource
            //===============================================*/

            if(post.ressource)
            {
                drawPost(doc, 'Autre(s) ressource(s) ou support(s) mobilisé(s)', post.ressource, '5_autres_ressources.png')
            }

            /*===============================================//
            // difficulty
            //===============================================*/

            if(post.difficulty)
            {
                drawPost(doc, 'Difficulté(s) rencontrée(s)', post.difficulty, '6_difficulte.png')
            }

            /*===============================================//
            // trick
            //===============================================*/

            if(post.trick)
            {   
                drawPost(doc, 'Astuces', post.trick, '7_astuces.png')
            }
            
            /*===============================================//
            // improvement
            //===============================================*/

            if(post.improvement)
            {
                drawPost(doc, 'Futurs imaginés pour cette situation', post.improvement, '8_futurs_imagines.png')
            }
            
            /*===============================================//
            // more
            //===============================================*/

            if(post.more)
            {
                drawPost(doc, 'En dire plus ?', post.more, '9_en_dire_plus.png')
            }
        }
    )

    doc.end() 
}

module.exports = {buildPDF}