const braintree = require("braintree");
import { serviceDS } from "../myDataSource"
import { Customer } from "../entity/customer.entity"
import { Product } from "../entity/product.entity"
import { Payment } from "../entity/payment.entity";
import { Request, Response } from "express"
const sendConfirmationEmail = require('../email/templates/paymentConfirmation');

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
        let myDataSource = await serviceDS;
        const products = await getOrderItems(req.body.payload.items);
        const customer = Object.assign( myDataSource.getRepository(Customer).create({id: req.body.payload.customerId}));
        const payment = Object.assign( myDataSource.getRepository(Payment).create({
            products: products,
            customer: customer,
            ...req.body.payload
        }));
        myDataSource.getRepository(Payment).save(payment).then(async(results) => {
            const savedPayment = await myDataSource.getRepository(Payment).findOne({
                where: {
                    id: results.id,
                }
            })
            sendConfirmationEmail(savedPayment)
            .then((response) => {
                return res.status(201).json(
                    {
                        email: "Email sent",
                        payment: results
                    }
                )
            }).catch((err) => {
                return res.status(500).json("Email not sent");
            })
        }).catch((err) => {
            return res.status(500).json("Payment not saved");
        })
        
        
      }
}

async function getTotalAmount(items){
    let myDataSource = await serviceDS;
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

async function getOrderItems(items){
    let myDataSource = await serviceDS;
    let dbItems = [];
    return await Promise.all(items.map(async (item) => {
        let dbItem = await myDataSource.getRepository(Product).findOne({
            where: {
                normalized: item.normalized,
            }
        })
        dbItems.push(dbItem);
    })).then(() => dbItems)
}

module.exports = paymentController;

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