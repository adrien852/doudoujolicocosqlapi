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

function getOrderNotifyBody(data){
    const products = data.products.map((product) => {
        return {
            objet: product.name,
            description: product.category.name[0].toUpperCase() + product.category.name.slice(1),
            prix: product.price+'€'
        }
    })
    const customer = {
        address: {
            name: data.customer.shippingAddress.name,
            address1: data.customer.shippingAddress.address1,
            address2: data.customer.shippingAddress.address2,
            cityPostalCode: data.customer.shippingAddress.postalCode+' '+data.customer.shippingAddress.city,
        },
        contact: {
            email: data.customer.email,
            phone: data.customer.shippingAddress.phone
        },
        payment: {
            paymentId: "Stripe Payment ID: "+data.payment.paymentId
        }
    };
    return {
        body: {
            greeting: 'Bonjour',
            signature: 'Happy knitting',
            name: 'Coco',
            intro: 'Un client a passé une commande sur Doudou Joli ! Veuillez en trouver les détails ci-dessous.',
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
            customerIntro: "L'adresse d'expédition et les informations de contact du client sont les suivantes:",
            customerData: customer,
            // action: {
            //     instructions: 'Vous pouvez me contacter par email pour connaitre l\'avancée de la préparation et expédition de votre commande à l\'adresse suivante : contact@doudoujoli.fr',
            //     button: {
            //         color: '#3869D4',
            //         text: 'Go to Dashboard',
            //         link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
            //     }
            // },
            outro: [
                'N\'oubliez pas de régulièrement donner des nouvelles au client sur l\'avancée de sa commande.',
            ]

        }
    };
}

module.exports = async function sendOrderNotifEmail(data){
    let MailGenerator = new Mailgen({
        theme: {
            path: path.resolve(__dirname, '../../assets/themes/orderNotification.html')
        },
        product: {
            name: 'Doudou Joli',
            link: process.env.CLIENT_HOST,
            logo: 'https://firebasestorage.googleapis.com/v0/b/doudoujoli-610f9.appspot.com/o/full_logo.png?alt=media&token=976ecd8d-f055-4176-a764-3e20352453e8'
        }
    });

    const email = getOrderNotifyBody(data);

    let mail = MailGenerator.generate(email);

    const mailData = {
        from: process.env.EMAIL_FROM,  // sender address
        to: process.env.EMAIL_FROM,   // list of receivers
        subject: 'Nouvelle commande sur Doudou Joli',
        html: mail,
    }  
    return transporter.sendMail(mailData);
}