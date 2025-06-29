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
        let orderProducts = await getOrderProducts(req.body.payload.cartItems);

        // Vérification du stock AVANT de créer la session Stripe
        for (const orderProduct of orderProducts) {
            if (!orderProduct.product) {
                return res.status(400).json({ error: `Produit introuvable.` });
            }
            if (orderProduct.product.stock !== undefined && orderProduct.qty > orderProduct.product.stock) {
                return res.status(400).json({
                    error: `Stock insuffisant pour le produit "${orderProduct.product.name}"`
                });
            }
        }

        const promo = await getPromo(req.body.payload.promoCode);

        // Calcul du total des produits
        const totalProducts = orderProducts.reduce((sum, orderProduct) => sum + Number(orderProduct.product.price) * orderProduct.qty, 0);

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

        // Vérifie si un paiement avec le même paymentId existe déjà
        const existingPayment = await myDataSource.getRepository(Payment).findOne({
            where: { paymentId: req.body.payload.paymentId }
        });
        if (existingPayment) {
            return res.status(400).json({ error: "Ce paiement existe déjà." });
        }

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
            const promo = await myDataSource.getRepository(Promo).findOne({
                where: {
                    code: req.body.payload.promo,
                }
            })
            const orderProducts = await getOrderProducts(req.body.payload.items);
            const orderItems = orderProducts.map(orderProduct => ({
                product: orderProduct.product,
                quantity: orderProduct.qty
            }));
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
                items: orderItems,
                customer: savedPayment.customer,
                promo: promo ? promo : null,
            }));
            //Save order
            myDataSource.getRepository(Order).save(order).then((results) => {
                if(process.env.NODE_ENV === 'production') {
                    //Send email to customer
                    sendConfirmationEmail(results);
                    //Send email to doudoujoli
                    sendOrderNotifEmail(results);
                }
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

async function getOrderProducts(products){
    let myDataSource = await serviceDS;
    let dbProducts = [];
    return await Promise.all(products.map(async (product) => {
        let dbProduct = await myDataSource.getRepository(Product).findOne({
            where: {
                normalized: product.normalized,
            }
        })
        dbProducts.push({product: dbProduct, qty: product.qty});
    })).then(() => dbProducts)
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