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
var app_data_source_1 = require("../app-data-source");
var customer_entity_1 = require("../entity/customer.entity");
var address_entity_1 = require("../entity/address.entity");
var CryptoJS = require("crypto-js");
var secretKey = process.env.SECRET_KEY;
function validateHmac(secretKey, receivedPayload) {
    return CryptoJS.enc.Hex.stringify(CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey).update(receivedPayload).finalize());
}
var customerController = {
    // all(req, res) {
    //   Product.find()
    //     .sort({ _id: -1 })
    //     .populate('category')
    //     .exec((err, products) => res.json(products)
    //     )
    // },
    save: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var serverHmac, shippingAddress, billingAddress, customer, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serverHmac = validateHmac(secretKey, req.body.payload);
                        if (!(serverHmac == req.body.hmac)) return [3 /*break*/, 6];
                        shippingAddress = Object.assign(app_data_source_1.myDataSource.getRepository(address_entity_1.Address).create(__assign({}, req.body.payload.shippingAddress)));
                        return [4 /*yield*/, app_data_source_1.myDataSource.getRepository(address_entity_1.Address).save(shippingAddress)];
                    case 1:
                        _a.sent();
                        billingAddress = null;
                        if (!req.body.payload.isSameAsShipping) return [3 /*break*/, 2];
                        billingAddress = shippingAddress;
                        return [3 /*break*/, 4];
                    case 2:
                        billingAddress = Object.assign(app_data_source_1.myDataSource.getRepository(address_entity_1.Address).create(__assign({}, req.body.payload.billingAddress)));
                        return [4 /*yield*/, app_data_source_1.myDataSource.getRepository(address_entity_1.Address).save(billingAddress)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        customer = app_data_source_1.myDataSource.getRepository(customer_entity_1.Customer).create({
                            id: req.body.payload.id,
                            email: req.body.payload.email,
                            shippingAddress: shippingAddress,
                            billingAddress: billingAddress
                        });
                        return [4 /*yield*/, app_data_source_1.myDataSource.getRepository(customer_entity_1.Customer).save(customer)];
                    case 5:
                        results = _a.sent();
                        return [2 /*return*/, res.send(results)];
                    case 6:
                        res.status(500).send('Wrong HMAC');
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    //   async savePaymentId(req, res){
    //     const payment = req.body.payload;
    //     const customerId = req.params.customerId;
    //     Customer.updateOne({_id: customerId}, {payment: payment}, function (err, response) {
    //       if(err){
    //         res.status(500).send(err);
    //       }
    //       else{
    //         res.json(response)
    //       }
    //     })
    //   }
};
module.exports = customerController;
