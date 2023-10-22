const braintree = require("braintree");
import { myDataSource } from "../app-data-source"
import { Customer } from "../entity/customer.entity"
import { Product } from "../entity/product.entity"
import { Payment } from "../entity/payment.entity";
import { Request, Response } from "express"
const productController = require('./product');


const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "2jw4v7rfxc3gmqf6",
  publicKey: "2xrfbr3ddmc7mqzd",
  privateKey: "f444444f850f2816b306a142548e6def"
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
        // const customer = await myDataSource.getRepository(Customer).find({
        //     where: {
        //         id: parseInt(req.body.payload.customerId),
        //     }
        // })
        const payment = Object.assign( myDataSource.getRepository(Payment).create({
            customer: customer,
            ...req.body.payload
        }));
        const results = await myDataSource.getRepository(Payment).save(payment);
        return res.send(results)
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