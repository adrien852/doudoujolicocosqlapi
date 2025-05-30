import { Request, Response } from "express"
import { serviceDS } from "../myDataSource"
import { Promo } from "../entity/promo.entity";

const promoController = {
    async all(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const promos = await myDataSource.getRepository(Promo).find({
            
        })
        res.send(promos)
    },

    async byId(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const promo = await myDataSource.getRepository(Promo).findOne({
            where: {
                id: Number(req.params.id),
            }
        })
        res.send(promo)
    },

    async update(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        let promoPayload = req.body.payload;
        const reqId = req.params.id;
        myDataSource.getRepository(Promo).update(reqId, {
            ...promoPayload
        }).then((results) => {
            res.send(results)
        }).catch((error) => {
            res.send(error)
        })
    },

    async save(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        let promoPayload = req.body.payload;
        myDataSource.getRepository(Promo).save({
            ...promoPayload
        }).then((results) => {
            res.send(results)
        }).catch((error) => {
            res.send(error)
        })
    },

    async delete(req: Request, res: Response){
        let myDataSource = await serviceDS;
        const reqId = req.params.id;
        myDataSource.getRepository(Promo).delete(reqId).then((results) => {
            res.send(results)
        });
    },
}

module.exports = promoController;