const braintree = require("braintree");
import { myDataSource } from "../app-data-source"
import { Customer } from "../entity/customer.entity"
import { Product } from "../entity/product.entity"
import { Payment } from "../entity/payment.entity";
import { Request, Response } from "express"
const productController = require('./product');
const nodemailer = require('nodemailer');
var Mailgen = require('mailgen');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

const paymentController = {
    initialize(req: Request, res: Response) {
        gateway.clientToken.generate({
        }, (err, response) => {
            if (response) {
                const clientToken = response.clientToken
                res.send({clientToken})            
            } else {
                res.status(500).send(err);
            }
        });
    },
    async checkout(req: Request, res: Response) {
        const nonceFromTheClient = req.body.payload.paymentMethodNonce;
        getTotalAmount(req.body.payload.cartItems).then((totalAmount) => {
            gateway.transaction.sale({
                amount: totalAmount,
                paymentMethodNonce: nonceFromTheClient,
                options: {
                    // This option requests the funds from the transaction
                    // once it has been authorized successfully
                    submitForSettlement: true
                }
            }, (error, result) => {
                if (result) {
                    res.send(result);
                } else {
                    res.status(500).send(error);
                }
            });
        })
    },
    async savePaymentId(req: Request, res: Response){
        const customer = Object.assign( myDataSource.getRepository(Customer).create({id: req.body.payload.customerId}));
        const payment = Object.assign( myDataSource.getRepository(Payment).create({
            customer: customer,
            ...req.body.payload
        }));
        myDataSource.getRepository(Payment).save(payment).then((results) => {
            sendConfirmationEmail()
            .then((response) => {
                return res.status(201).json(
                    {
                        email: "Email sent",
                        payment: results
                    }
                )
            }).catch((err) => {
                return res.status(500).json({ msg: err });
            })
        }).catch((err) => {
            return res.status(500).json(err);
        })
        
        
      }
}

async function getTotalAmount(items){
    let totalAmount = 0;
    return await Promise.all(items.map(async (item) => {
        const apiItem = await myDataSource.getRepository(Product).findOne({
            where: {
                normalized: item.normalized,
            }
        })
        totalAmount += apiItem.price * item.qty;
    })).then(() => totalAmount)
    
}

module.exports = paymentController;

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendConfirmationEmail(){
    let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'YOUR_PRODUCT_NAME',
            link: 'https://mailgen.js/'
        }
    });

    let response = {
        body: {
            name: 'Name',
            intro: 'Welcome to ABC Company! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with ABC, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: 'https://mailgen.js/'
                }
            }
        }
    };

    let mail = MailGenerator.generate(response);

    const mailData = {
        from: 'durougeadrien@gmail.com',  // sender address
        to: 'durougeadrien@gmail.com',   // list of receivers
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        html: mail,
    }  
    return transporter.sendMail(mailData);
}

// gateway.transaction.sale({
//     amount: totalPrice,
//     paymentMethodNonce: nonceFromTheClient,
//     options: {
//     // This option requests the funds from the transaction
//     // once it has been authorized successfully
//     submitForSettlement: true
//     }
// }, (error, result) => {
//     if (result) {
//         res.send(result);
//     } else {
//         res.status(500).send(error);
//     }
// });