"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var braintree = require("braintree");
var app_data_source_1 = require("../app-data-source");
var customer_entity_1 = require("../entity/customer.entity");
var product_entity_1 = require("../entity/product.entity");
var payment_entity_1 = require("../entity/payment.entity");
var productController = require('./product');
var nodemailer = require('nodemailer');
var Mailgen = require('mailgen');
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});
var paymentController = {
    test: function (req, res) {
        sendConfirmationEmail()
            .then(function (response) {
            return res.status(201).json({
                msg: "Email sent",
                info: response.messageId,
                preview: nodemailer.getTestMessageUrl(response)
            });
        }).catch(function (err) {
            return res.status(500).json({ msg: err });
        });
    },
    initialize: function (req, res) {
        gateway.clientToken.generate({}, function (err, response) {
            if (response) {
                var clientToken = response.clientToken;
                res.send({ clientToken: clientToken });
            }
            else {
                res.status(500).send(err);
            }
        });
    },
    checkout: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var nonceFromTheClient;
            return __generator(this, function (_a) {
                nonceFromTheClient = req.body.payload.paymentMethodNonce;
                getTotalAmount(req.body.payload.cartItems).then(function (totalAmount) {
                    gateway.transaction.sale({
                        amount: totalAmount,
                        paymentMethodNonce: nonceFromTheClient,
                        options: {
                            // This option requests the funds from the transaction
                            // once it has been authorized successfully
                            submitForSettlement: true
                        }
                    }, function (error, result) {
                        if (result) {
                            res.send(result);
                        }
                        else {
                            res.status(500).send(error);
                        }
                    });
                });
                return [2 /*return*/];
            });
        });
    },
    savePaymentId: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var customer, payment;
            return __generator(this, function (_a) {
                customer = Object.assign(app_data_source_1.myDataSource.getRepository(customer_entity_1.Customer).create({ id: req.body.payload.customerId }));
                payment = Object.assign(app_data_source_1.myDataSource.getRepository(payment_entity_1.Payment).create(__assign({ customer: customer }, req.body.payload)));
                app_data_source_1.myDataSource.getRepository(payment_entity_1.Payment).save(payment).then(function (results) {
                    sendConfirmationEmail()
                        .then(function (response) {
                        return res.status(201).json({
                            email: "Email sent",
                            payment: results
                        });
                    }).catch(function (err) {
                        return res.status(500).json({ msg: err });
                    });
                }).catch(function (err) {
                    return res.status(500).json(err);
                });
                return [2 /*return*/];
            });
        });
    }
};
function getTotalAmount(items) {
    return __awaiter(this, void 0, void 0, function () {
        var totalAmount;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    totalAmount = 0;
                    return [4 /*yield*/, Promise.all(items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var apiItem;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, app_data_source_1.myDataSource.getRepository(product_entity_1.Product).findOne({
                                            where: {
                                                normalized: item.normalized,
                                            }
                                        })];
                                    case 1:
                                        apiItem = _a.sent();
                                        totalAmount += apiItem.price * item.qty;
                                        return [2 /*return*/];
                                }
                            });
                        }); })).then(function () { return totalAmount; })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
module.exports = paymentController;
var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
function sendConfirmationEmail() {
    return __awaiter(this, void 0, void 0, function () {
        var MailGenerator, response, mail, mailData;
        return __generator(this, function (_a) {
            MailGenerator = new Mailgen({
                theme: 'default',
                product: {
                    name: 'YOUR_PRODUCT_NAME',
                    link: 'https://mailgen.js/'
                }
            });
            response = {
                body: {
                    name: 'Name',
                    intro: 'Welcome to ABC Company! We\'re very excited to have you on board.',
                    action: {
                        instructions: 'To get started with ABC, please click here:',
                        button: {
                            color: '#22BC66',
                            text: 'Confirm your account',
                            link: 'https://mailgen.js/'
                        }
                    }
                }
            };
            mail = MailGenerator.generate(response);
            mailData = {
                from: 'durougeadrien@gmail.com',
                to: 'durougeadrien@gmail.com',
                subject: 'Sending Email using Node.js',
                text: 'That was easy!',
                html: mail,
            };
            return [2 /*return*/, transporter.sendMail(mailData)];
        });
    });
}
// gateway.transaction.sale({
//     amount: totalPrice,
//     paymentMethodNonce: nonceFromTheClient,
//     options: {
//     // This option requests the funds from the transaction
//     // once it has been authorized successfully
//     submitForSettlement: true
//     }
// }, (error, result) => {
//     if (result) {
//         res.send(result);
//     } else {
//         res.status(500).send(error);
//     }
// });
