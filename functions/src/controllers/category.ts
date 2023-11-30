import { serviceDS } from "../myDataSource"
import { Category } from "../entity/category.entity"
import { Request, Response } from "express"

const categoryController = {
    async all(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const categories = await myDataSource.getRepository(Category).find()
        res.send(categories)
    },

    async byNormalized(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const category = await myDataSource.getRepository(Category).findOne({
            where: {
                normalized: req.params.normalized,
            }
        })
        res.send(category)
    },

    async byId(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const category = await myDataSource.getRepository(Category).findOne({
            where: {
                id: Number(req.params.id),
            }
        })
        res.send(category)
    },

    async update(req: Request, res: Response){
        let myDataSource = await serviceDS;
        const productPayload = req.body.payload;
        const reqId = req.params.id;
        myDataSource.getRepository(Category).update(reqId, {
            ...productPayload
        }).then((results) => {
            res.send(results)
        }).catch((error) => {
            res.send(error)
        })
    },

    async delete(req: Request, res: Response){
        let myDataSource = await serviceDS;
        const reqId = req.params.id;
        myDataSource.getRepository(Category).delete(reqId).then((results) => {
            res.send(results)
        });
    },

    async save(req: Request, res: Response){
        let myDataSource = await serviceDS;
        const productPayload = req.body.payload;
        myDataSource.getRepository(Category).save({
            ...productPayload
        }).then((results) => {
            res.send(results)
        }).catch((error) => {
            res.send(error)
        })
    },
}

module.exports = categoryController;