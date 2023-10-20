import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { myDataSource } from "../app-data-source"
import { Product } from "../entity/product.entity"
import { Request, Response } from "express"
import { Category } from "../entity/category.entity";

const productController = {
    async all(req: Request, res: Response) {
        res.header("Access-Control-Allow-Origin", "*");
        const products = await myDataSource.getRepository(Product).find({
            
        })
        res.send(products)
    },
    
    async byNormalized(req: Request, res: Response) {
        res.header("Access-Control-Allow-Origin", "*");
        const products = await myDataSource.getRepository(Product).findOne({
            where: {
                normalized: req.params.normalized,
            }
        })
        res.send(products)
    },

    async byCategory(req: Request, res: Response) {
        res.header("Access-Control-Allow-Origin", "*");
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