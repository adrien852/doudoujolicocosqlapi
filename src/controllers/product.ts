import { myDataSource } from "../app-data-source"
import { Product } from "../entity/product.entity"
import { Request, Response } from "express"

const productController = {
    async all(req: Request, res: Response) {
        const products = await myDataSource.getRepository(Product).find()
        res.json(products)
    },
    
    async byNormalized(req: Request, res: Response) {
        const results = await myDataSource.getRepository(Product).findOneBy({
            normalized: req.params.normalized,
        })
        return res.send(results)
    },

    // async byCategory(req: Request, res: Response) {
    //     const results = await myDataSource.getRepository(Product).findOneBy({
    //         normalized: req.params.normalized,
    //     })
    //     return res.send(results)
    // }
}

module.exports = productController;