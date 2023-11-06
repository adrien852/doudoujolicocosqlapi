import { Request, Response } from "express"
import { serviceDS } from "../myDataSource"
import { Order } from "../entity/order.entity";

const orderController = {
    async all(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const orders = await myDataSource.getRepository(Order).find({
            
        })
        res.send(orders)
    }
}

module.exports = orderController;