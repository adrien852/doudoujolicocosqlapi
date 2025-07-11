import * as express from "express"

const productController = require('../../controllers/product');
const categoryController = require('../../controllers/category');
const paymentController = require('../../controllers/payment');
const customerController = require('../../controllers/customer');
const orderController = require('../../controllers/order');
const emailController = require('../../controllers/contact')
const promoController = require('../../controllers/promo');
const authenticationMiddleware = require('../../middleware/authentication')

const router = express.Router();

router.get("/products", productController.allAvailable)
router.get("/products/categories/:category", productController.byCategory)
router.get("/products/:normalized", productController.byNormalized)

router.get("/categories", categoryController.all)
router.get("/categories/:normalized", categoryController.byNormalized)

router.post("/signIn", customerController.signIn)
router.post("/login", customerController.login)

router.post('/payment/save', paymentController.savePaymentId);
router.post('/payment/checkout', paymentController.checkout);
router.get('/payment/session', paymentController.getSessionStatus);

router.post("/email/contact", emailController.sendContact)

//Admin API
router.get("/loginCheck", authenticationMiddleware.authenticateAdminToken, authenticationMiddleware.loginCheck)

router.get("/inventory/products", authenticationMiddleware.authenticateAdminToken, productController.all)
router.put("/inventory/products/:id", authenticationMiddleware.authenticateAdminToken, productController.update)
router.get("/inventory/products/:id", authenticationMiddleware.authenticateAdminToken, productController.byId)
router.post("/inventory/products", authenticationMiddleware.authenticateAdminToken, productController.save)
router.delete("/inventory/products/:id", authenticationMiddleware.authenticateAdminToken, productController.delete)

router.get("/inventory/categories", authenticationMiddleware.authenticateAdminToken, categoryController.all)
router.put("/inventory/categories/:id", authenticationMiddleware.authenticateAdminToken, categoryController.update)
router.get("/inventory/categories/:id", authenticationMiddleware.authenticateAdminToken, categoryController.byId)
router.post("/inventory/categories", authenticationMiddleware.authenticateAdminToken, categoryController.save)
router.delete("/inventory/categories/:id", authenticationMiddleware.authenticateAdminToken, categoryController.delete)

router.get("/orders", authenticationMiddleware.authenticateAdminToken, orderController.all)
router.get("/order/:reference", authenticationMiddleware.authenticateAdminToken, orderController.byReference)
router.put("/order/:reference", authenticationMiddleware.authenticateAdminToken, orderController.update)
router.post("/order/sendEmail/:reference", authenticationMiddleware.authenticateAdminToken, orderController.sendEmail)

router.get("/promos", authenticationMiddleware.authenticateAdminToken, promoController.all)
router.get("/promo/:id", authenticationMiddleware.authenticateAdminToken, promoController.byId)
router.get("/promo/code/:code", promoController.byCode)
router.put("/promo/:id", authenticationMiddleware.authenticateAdminToken, promoController.update)
router.post("/promos", authenticationMiddleware.authenticateAdminToken, promoController.save)
router.delete("/promo/:id", authenticationMiddleware.authenticateAdminToken, promoController.delete)

router.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong" });
});

module.exports = router;