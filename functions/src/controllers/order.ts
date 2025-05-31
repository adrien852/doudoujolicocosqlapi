import { Request, Response } from "express"
import { serviceDS } from "../myDataSource"
import { Order } from "../entity/order.entity";
const sendStatusChanged = require('../email/templates/statusChange');

const orderController = {
    async all(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const orders = await myDataSource.getRepository(Order).find({
            order: {
                createdAt: "DESC"
            }
        })
        res.send(orders)
    },
    async byReference(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const order = await myDataSource.getRepository(Order).findOne({
            where: {
                reference: req.params.reference,
            }
        })
        res.send(order)
    },
    async update(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const orderPayload = req.body.payload;
        const orderRef = req.params.reference;
        let order = await myDataSource.getRepository(Order).findOne({
            where: {
                reference: orderRef,
            }
        })
        myDataSource.getRepository(Order).update(order.id, {
            status: orderPayload.status
        }).then((results) => {
            res.send(results)
        });
    },
    async sendEmail(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const orderRef = req.params.reference;
        const order = await myDataSource.getRepository(Order).findOne({
            where: {
                reference: orderRef
            }
        })
        myDataSource.getRepository(Order).update(order.id, {
            trackingNumber: req.body.payload.trackingNumber
        })
        const data = {...order, ...req.body.payload}
        await sendStatusChanged(data);
        return res.status(201).json(
            {
                message: "Email sent"
            }
        )
    }
}

module.exports = orderController;