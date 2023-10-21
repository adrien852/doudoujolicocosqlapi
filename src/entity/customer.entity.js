"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
var typeorm_1 = require("typeorm");
var product_entity_1 = require("./product.entity");
var address_entity_1 = require("./address.entity");
var payment_entity_1 = require("./payment.entity");
var Customer = /** @class */ (function () {
    function Customer() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Customer.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", String)
    ], Customer.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return address_entity_1.Address; }, {
            cascade: true,
        }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", address_entity_1.Address)
    ], Customer.prototype, "shippingAddress", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return address_entity_1.Address; }, {
            cascade: true,
        }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", address_entity_1.Address)
    ], Customer.prototype, "billingAddress", void 0);
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return product_entity_1.Product; }),
        (0, typeorm_1.JoinTable)(),
        __metadata("design:type", Array)
    ], Customer.prototype, "products", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return payment_entity_1.Payment; }, function (payment) { return payment.customer; }),
        __metadata("design:type", Array)
    ], Customer.prototype, "payments", void 0);
    Customer = __decorate([
        (0, typeorm_1.Entity)()
    ], Customer);
    return Customer;
}());
exports.Customer = Customer;
