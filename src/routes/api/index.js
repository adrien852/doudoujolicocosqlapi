"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app_data_source_1 = require("../../app-data-source");
var productController = require('../../controllers/product');
var categoryController = require('../../controllers/category');
// const paymentController = require('../../controllers/payment');
var customerController = require('../../controllers/customer');
// establish database connection
app_data_source_1.myDataSource
    .initialize()
    .then(function () {
    console.log("Data Source has been initialized!");
})
    .catch(function (err) {
    console.error("Error during Data Source initialization:", err);
});
var router = express.Router();
router.get("/products", productController.all);
router.get("/products/:normalized", productController.byNormalized);
router.get("/categories/:category", productController.byCategory);
router.get("/categories", categoryController.all);
router.post("/customers", customerController.save);
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
