var nodemailer = require('nodemailer');
var Mailgen = require('mailgen');
var path = require('path')

var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function getContactBody(data){
    const contactData = {
            Nom: data.name,
            Email: data.email,
            Message: data.body
        }
    return {
        body: {
            greeting: 'Bonjour',
            signature: 'A bientot',
            name: 'Coco',
            intro: 'Quelqu\'un vous a écrit un message en utilisant le formulaire de contact sur Doudou Joli.',
            bodyData: contactData

        }
    };
}

module.exports = async function sendContactEmail(data){
    let MailGenerator = new Mailgen({
        theme: {
            path: path.resolve(__dirname, '../../assets/themes/contact.html')
        },
        product: {
            name: 'Doudou Joli',
            link: process.env.CLIENT_HOST,
            logo: 'https://firebasestorage.googleapis.com/v0/b/doudoujoli-610f9.appspot.com/o/full_logo.png?alt=media&token=976ecd8d-f055-4176-a764-3e20352453e8'
        }
    });

    const email = getContactBody(data);

    let mail = MailGenerator.generate(email);

    const mailData = {
        from: process.env.EMAIL_FROM,  // sender address
        to: process.env.EMAIL_FROM,   // list of receivers
        subject: 'Nouveau message sur Doudou Joli',
        html: mail,
    }  
    return transporter.sendMail(mailData);
}