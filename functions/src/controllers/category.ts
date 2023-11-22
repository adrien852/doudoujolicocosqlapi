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
}

module.exports = categoryController;