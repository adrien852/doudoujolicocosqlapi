import { serviceDS } from "../myDataSource"
import { Product } from "../entity/product.entity"
import { Request, Response } from "express"

const productController = {
    async all(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const products = await myDataSource.getRepository(Product).find({
            
        })
        res.send(products)
    },
    
    async byNormalized(req: Request, res: Response) {
        let myDataSource = await serviceDS;
        const product = await myDataSource.getRepository(Product).findOne({
            where: {
                normalized: req.params.normalized,
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
                }
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
        });
    }
}

module.exports = productController;