const braintree = require("braintree");
const stripe = require('stripe')(`${process.env.STRIPE_API_KEY}`);
import { serviceDS } from "../myDataSource"
import { Customer } from "../entity/customer.entity"
import { Product } from "../entity/product.entity"
import { Payment } from "../entity/payment.entity";
import { Promo } from "../entity/promo.entity";
import { Request, Response } from "express"
import { Order } from "../entity/order.entity";
const sendConfirmationEmail = require('../email/templates/paymentConfirmation');
const sendOrderNotifEmail = require('../email/templates/orderNotification');
const customerController = require('./customer');

const paymentController = {

    async checkout(req: Request, res: Response) {
        let products = await getOrderItems(req.body.payload.cartItems);
        const promo = await getPromo(req.body.payload.promoCode);
        console.log("Promo", promo);

        // Calcul du total des produits
        const totalProducts = products.reduce((sum, product) => sum + Number(product.price), 0);

        let discount = 0;
        if (promo && promo.amount > 0) {
            if (promo.type === "Pourcentage") {
                discount = Math.round(totalProducts * (Number(promo.amount) / 100) * 100) / 100;
            } else {
                discount = Number(promo.amount);
            }
        }

        // On applique la réduction
        let totalFinal = totalProducts - discount;
        if (totalFinal < 0) totalFinal = 0;

        const session = await stripe.checkout.sessions.create({
            locale: 'fr',
            ui_mode: 'embedded',
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: "Commande DoudouJoli"
                        },
                        unit_amount: Math.round(totalFinal * 100)
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            shipping_address_collection: {
                allowed_countries: ['FR'],
            },
            // shipping_options:[{
            //     //stripe shipping_rates create --display-name="Livraison standard" --type="fixed_amount" -d "fixed_amount[amount]=1000" -d "fixed_amount[currency]=eur" -d "delivery_estimate[maximum][unit]=business_day" -d "delivery_estimate[maximum][value]=10" -d "delivery_estimate[minimum][unit]=business_day" -d "delivery_estimate[minimum][value]=5" 
            //     shipping_rate: "shr_1OeGaBI95XdS21zVuhJ5PG25"
            // }],
            payment_method_types: ['card', 'paypal'],
            return_url: `${process.env.CLIENT_HOST}/confirmation-paiement?session_id={CHECKOUT_SESSION_ID}`,
        });
        
        res.send({ clientSecret: session.client_secret });
    },

    async getSessionStatus(req: Request, res: Response){
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

        let customerId = null;
        if(session.status === "complete"){
            await customerController.saveCustomerInfo(session.customer_details).then(customer => {
                customerId = customer.id;
            })
        }

        res.send({
            status: session.status,
            customerId: customerId,
            data: session
        });
    },

    async savePaymentId(req: Request, res: Response){
        let myDataSource = await serviceDS;
        
        const customer = Object.assign( myDataSource.getRepository(Customer).create({id: req.body.payload.customerId}));
        const payment = Object.assign( myDataSource.getRepository(Payment).create({
            customer: customer,
            ...req.body.payload
        }));
        myDataSource.getRepository(Payment).save(payment).then(async(results) => {
            //Retrieve full payment entry
            const savedPayment = await myDataSource.getRepository(Payment).findOne({
                where: {
                    id: results.id,
                }
            })
            const products = await getOrderItems(req.body.payload.items);
            //Create random reference number until it is unique
            let uniqueReference = "";
            let existingOrder = null;
            do{
                console.log("generating")
                uniqueReference = randomRef();
                existingOrder = await myDataSource.getRepository(Order).findOne({
                    where: {
                        reference: uniqueReference,
                    }
                })
            }
            while(existingOrder)
            const order = Object.assign( myDataSource.getRepository(Order).create({
                reference: uniqueReference,
                payment: savedPayment,
                products: products,
                customer: savedPayment.customer
            }));
            //Save order
            myDataSource.getRepository(Order).save(order).then((results) => {
                //Send email to customer
                sendConfirmationEmail(results);
                //Send email to doudoujoli
                sendOrderNotifEmail(results);
                return res.status(201).json(
                    {
                        message: "Payment and order saved",
                        order: results
                    }
                )
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

async function getPromo(promoCode){
    let myDataSource = await serviceDS;
    const promo = await myDataSource.getRepository(Promo).findOne({
        where: {
            code: String(promoCode),
        }
    })
    return promo;
}

function randomRef() {
    let numbers = '0123456789';
    var result = 'C';
    for (var i = 4; i > 0; --i) result += numbers[Math.floor(Math.random() * numbers.length)];
    return result;
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