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

const statusFr = {
    PENDING: "en attente",
    IN_PROGRESS: "en traitement",
    SHIPPED: "expédiée",
    DELIVERED: "livrée"
}

function getStatusChangeBody(data){
    const products = [
        ...data.items.map((item) => {
            return {
                objet: item.product.name + ' x' + item.quantity,
                description: item.product.category.name[0].toUpperCase() + item.product.category.name.slice(1),
                prix: (item.product.price * item.quantity).toFixed(2) + '€'
            }
        }),
        { empty: '' },
        ...(data.promo ? [{
            objet: '',
            description: "Code Promotionnel",
            prix: '-' + (data.promo.type === 'Pourcentage' ? Math.round(data.promo.amount) + '%' : data.promo.amount.toFixed(2) + '€')
        }, { empty: '' }] : []),
        {
            objet: '',
            description: 'Total',
            prix: (() => {
                const total = data.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                let finalTotal = total;
                if (data.promo) {
                    if (data.promo.type === 'Pourcentage') {
                        finalTotal = total - (total * data.promo.amount / 100);
                    } else {
                        finalTotal = total - data.promo.amount;
                    }
                }
                return finalTotal.toFixed(2) + '€';
            })()
        }
    ]

    let emailContent = {
        body: {
            greeting: 'Bonjour',
            signature: 'A bientôt',
            name: data.customer.shippingAddress.name,
            intro: 'Votre commande a été mise à jour. Elle est désormais '+`<b>${statusFr[data.newStatus]}</b>.`,
            table: [{
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
            }],
            // action: {
            //     instructions: 'Vous pouvez me contacter par email pour connaitre l\'avancée de la préparation et expédition de votre commande à l\'adresse suivante : contact@doudoujoli.fr',
            //     button: {
            //         color: '#3869D4',
            //         text: 'Go to Dashboard',
            //         link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
            //     }
            // },
            outro: [
                'Vous pouvez me contacter par email ou répondre à cet email pour connaitre l\'avancée de la préparation et de l\'expédition de votre commande à l\'adresse suivante : doudoujolicoco@gmail.com',
                'Merci beaucoup pour votre confiance.'
            ]

        }
    };

    if (data.trackingNumber && data.trackingNumber.trim() !== '') {
        emailContent.body.table.push({
            data: [],
            title: '<span style="font-weight:normal">Numéro de suivi Colissimo :</span> ' + data.trackingNumber,
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
        });
    }
    
    return emailContent;
}

module.exports = async function sendStatusChanged(data){
    let MailGenerator = new Mailgen({
        theme: {
            path: path.resolve(__dirname, '../../assets/themes/paymentConfirmation.html')
        },
        product: {
            name: 'Doudou Joli',
            link: process.env.CLIENT_HOST,
            logo: 'https://firebasestorage.googleapis.com/v0/b/doudoujoli-610f9.appspot.com/o/full_logo.png?alt=media&token=4e92179e-30ad-4b67-804b-4b2894c41b31'
        }
    });

    const email = getStatusChangeBody(data);

    let mail = MailGenerator.generate(email);

    const mailData = {
        from: process.env.EMAIL_FROM,  // sender address
        to: data.customer.email,   // list of receivers
        subject: 'Commande '+`${statusFr[data.newStatus]}`,
        html: mail,
    }  
    return transporter.sendMail(mailData);
}