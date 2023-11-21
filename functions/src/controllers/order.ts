import { Request, Response } from "express"
import { myDataSource } from "../myDataSource"
import { Order } from "../entity/order.entity";

const orderController = {
    async all(req: Request, res: Response) {
        
        const orders = await myDataSource.getRepository(Order).find({
            
        })
        res.send(orders)
    },
    async byReference(req: Request, res: Response) {
        
        const order = await myDataSource.getRepository(Order).findOne({
            where: {
                reference: req.params.reference,
            }
        })
        res.send(order)
    },
    async update(req: Request, res: Response) {
        
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
    }
}

module.exports = orderController;