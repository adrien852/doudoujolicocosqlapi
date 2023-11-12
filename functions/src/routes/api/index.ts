import * as express from "express"

const productController = require('../../controllers/product');
const categoryController = require('../../controllers/category');
const paymentController = require('../../controllers/payment');
const customerController = require('../../controllers/customer');
const orderController = require('../../controllers/order');

const router = express.Router();

router.get("/products", productController.all)
router.get("/products/categories/:category", productController.byCategory)
router.get("/products/:normalized", productController.byNormalized)
router.put("/inventory/products/:id", productController.update)
router.get("/inventory/products/:id", productController.byId)

router.get("/categories", categoryController.all)
router.get("/categories/:normalized", categoryController.byNormalized)

router.post("/customers", customerController.save)

router.post('/payment/save', paymentController.savePaymentId);
router.get('/payment/initialize', paymentController.initialize);
router.post('/payment/checkout', paymentController.checkout);

router.get("/orders", orderController.all)
router.get("/order/:reference", orderController.byReference)
router.put("/order/:reference", orderController.update)

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