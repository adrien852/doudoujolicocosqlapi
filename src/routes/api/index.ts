import * as express from "express"
import { myDataSource } from "../../app-data-source"

const productController = require('../../controllers/product');
const categoryController = require('../../controllers/category');
const paymentController = require('../../controllers/payment');
const customerController = require('../../controllers/customer');

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
router.get("/products/categories/:category", productController.byCategory)
router.get("/products/:normalized", productController.byNormalized)

router.get("/categories", categoryController.all)
router.get("/categories/:normalized", categoryController.byNormalized)

router.post("/customers", customerController.save)

router.post('/payment/save', paymentController.savePaymentId);
router.get('/payment/initialize', paymentController.initialize);
router.post('/payment/checkout', paymentController.checkout);

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