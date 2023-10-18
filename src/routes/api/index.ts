import { Request, Response } from "express"
import * as express from "express"
import { myDataSource } from "../../app-data-source"
import { Product } from "../../entity/product.entity"

const productController = require('../../controllers/product');
// const categoryController = require('../../controllers/category');
// const paymentController = require('../../controllers/payment');
// const customerController = require('../../controllers/customer');

// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

const router = express.Router();

router.get("/products", productController.all)

router.get("/products/:name", productController.byNormalized)

// router.get("/products/:category", productController.byCategory)

// router.post("/products", async function (req: Request, res: Response) {
//     const product = await myDataSource.getRepository(Product).create(req.body)
//     const results = await myDataSource.getRepository(Product).save(product)
//     return res.send(results)
// })

// router.put("/products/:id", async function (req: Request, res: Response) {
//     const product = await myDataSource.getRepository(Product).findOneBy({
//         id: Number(req.params.id),
//     })
//     myDataSource.getRepository(Product).merge(product, req.body)
//     const results = await myDataSource.getRepository(Product).save(product)
//     return res.send(results)
// })

// router.delete("/products/:id", async function (req: Request, res: Response) {
//     const results = await myDataSource.getRepository(Product).delete(req.params.id)
//     return res.send(results)
// })

module.exports = router;