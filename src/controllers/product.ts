import { myDataSource } from "../app-data-source"
import { Product } from "../entity/product.entity"
import { Request, Response } from "express"

const productController = {
    async all(req: Request, res: Response) {
        
        const products = await myDataSource.getRepository(Product).find({
            
        })
        res.send(products)
    },
    
    async byNormalized(req: Request, res: Response) {
        
        const product = await myDataSource.getRepository(Product).findOne({
            where: {
                normalized: req.params.normalized,
            }
        })
        res.send(product)
    },

    async byCategory(req: Request, res: Response) {
        
        const results = await myDataSource.getRepository(Product).find({
            where: {
                category: {
                    normalized: req.params.category
                }
            }
        })
        return res.send(results)
    }
}

module.exports = productController;