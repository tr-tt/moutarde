const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
{         
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth:
    {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }          
})

const mailer = {}

mailer.sendAccountCreated = (emailData) =>
{
    const html =
    `
        <img src="https://mon-carnet-hercule.fr/static/images/logo_hercule.png" width="400px" draggable="false">

        <h1 style="font-size: 20px;color: #5f6368;">Bienvenu sur la plateforme HERCULE !</h1>

        <p style="font-size: 18px;text-align: justify;color: #5f6368;">Votre compte utilisateur <strong style="color: #F8AC00;">${emailData.username}</strong> a bien été créé, vous pouvez désormais vous connecter avec en cliquant sur le lien ci-dessous.</p>

        ${emailData.link}
    `

    const email =
    {
        from: process.env.EMAIL_USER,
        to: emailData.email,
        subject: `[HERCULE] Création du compte utilisateur.`,
        text: `[HERCULE] Création du compte utilisateur.`,
        html: html
    }

    return transporter.sendMail(email)
}

mailer.sendPasswordLink = (emailData) =>
{
    const html =
    `
        <img src="https://mon-carnet-hercule.fr/static/images/logo_hercule.png" width="400px" draggable="false">

        <h1 style="font-size: 20px;color: #5f6368;">Votre demande de changement de mot de passe sur la plateforme HERCULE a été prise en compte.</h1>
        
        <p style="font-size: 18px;text-align: justify;color: #5f6368;">Vous pouvez cliquer sur le lien ci-dessous, valide pendant <strong style="color: #F8AC00;">15 mintutes</strong>, pour procéder au changement.</p>

        ${emailData.link}
    `

    const email =
    {
        from: process.env.EMAIL_USER,
        to: emailData.email,
        subject: `[HERCULE] Demande de réinitialisation de mot de passe.`,
        text: `[HERCULE] Demande de réinitialisation de mot de passe.`,
        html: html
    }

    return transporter.sendMail(email)
}

module.exports = mailer