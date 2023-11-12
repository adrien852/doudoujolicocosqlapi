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

function getPaymentConfirmationBody(data){
    const products = data.products.map((product) => {
        return {
            objet: product.name,
            description: product.category.name[0].toUpperCase() + product.category.name.slice(1),
            prix: product.price+'€'
        }
    })
    return {
        body: {
            greeting: 'Bonjour',
            signature: 'A bientôt',
            name: data.customer.shippingAddress.firstName,
            intro: 'Votre commande a bien été reçue. Veuillez en trouver les détails ci-dessous.',
            table: {
                data: products,
                title: 'Commande #'+data.reference,
                columns: {
                    // Optionally, customize the column widths
                    customWidth: {
                        item: '20%',
                        price: '15%'
                    },
                    // Optionally, change column text alignment
                    customAlignment: {
                        price: 'right'
                    }
                }
            },
            // action: {
            //     instructions: 'Vous pouvez me contacter par email pour connaitre l\'avancé de la préparation et expédition de votre commande à l\'adresse suivante : contact@doudoujoli.fr',
            //     button: {
            //         color: '#3869D4',
            //         text: 'Go to Dashboard',
            //         link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
            //     }
            // },
            outro: [
                'Vous pouvez me contacter par email pour connaitre l\'avancé de la préparation et de l\'expédition de votre commande à l\'adresse suivante : contact@doudoujoli.fr',
                'Merci beaucoup pour votre confiance.'
            ]

        }
    };
}

module.exports = async function sendConfirmationEmail(data){
    let MailGenerator = new Mailgen({
        theme: {
            path: path.resolve(__dirname, '../../assets/themes/paymentConfirmation.html')
        },
        product: {
            name: 'Doudou Joli',
            link: process.env.CLIENT_HOST,
            // logo: 'https://doudoujolicoco.onrender.com/assets/full_logo-658056d8.png'
            logo: process.env.API_HOST+'/images/full_logo.png'
        }
    });

    const email = getPaymentConfirmationBody(data);

    let mail = MailGenerator.generate(email);

    const mailData = {
        from: process.env.EMAIL_FROM,  // sender address
        to: data.customer.email,   // list of receivers
        subject: 'Confirmation de votre commande Doudou Joli',
        html: mail,
    }  
    return transporter.sendMail(mailData);
}