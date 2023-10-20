import { myDataSource } from "../app-data-source"
import { Category } from "../entity/category.entity"
import { Request, Response } from "express"

const categoryController = {
    async all(req: Request, res: Response) {
        res.header("Access-Control-Allow-Origin", "*");
        const categories = await myDataSource.getRepository(Category).find()
        res.send(categories)
    }
}

module.exports = categoryController;