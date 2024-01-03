import { serviceDS } from "../myDataSource"
import { Product } from "../entity/product.entity"
import { Request, Response } from "express"
import { MoreThan } from "typeorm";

const productController = {
    async all(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const products = await myDataSource.getRepository(Product).find({
            order: {
                id: "DESC"
            }
        })
        res.send(products)
    },

    async allAvailable(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const products = await myDataSource.getRepository(Product).find({
            where: {
                stock: MoreThan(0)
            },
            order: {
                id: "DESC"
            }
        })
        res.send(products)
    },
    
    async byNormalized(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const product = await myDataSource.getRepository(Product).findOne({
            where: {
                normalized: req.params.normalized,
                stock: MoreThan(0)
            }
        })
        res.send(product)
    },

    async byId(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const product = await myDataSource.getRepository(Product).findOne({
            where: {
                id: Number(req.params.id),
            }
        })
        res.send(product)
    },

    async byCategory(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const results = await myDataSource.getRepository(Product).find({
            where: {
                category: {
                    normalized: req.params.category
                },
                stock: MoreThan(0)
            }
        })
        return res.send(results)
    },

    async update(req: Request, res: Response){
        let myDataSource = await serviceDS;
        const productPayload = req.body.payload;
        const reqId = req.params.id;
        myDataSource.getRepository(Product).update(reqId, {
            ...productPayload
        }).then((results) => {
            res.send(results)
        }).catch((error) => {
            res.send(error)
        })
    },

    async save(req: Request, res: Response){
        let myDataSource = await serviceDS;
        const productPayload = req.body.payload;
        myDataSource.getRepository(Product).save({
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
        myDataSource.getRepository(Product).delete(reqId).then((results) => {
            res.send(results)
        });
    }
}

module.exports = productController;