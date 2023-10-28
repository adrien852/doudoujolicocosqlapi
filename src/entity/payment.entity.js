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
exports.Payment = void 0;
var typeorm_1 = require("typeorm");
var customer_entity_1 = require("./customer.entity");
var Payment = /** @class */ (function () {
    function Payment() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Payment.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ nullable: false }),
        __metadata("design:type", String)
    ], Payment.prototype, "paymentId", void 0);
    __decorate([
        (0, typeorm_1.Column)('decimal', { precision: 6, scale: 2, nullable: false }),
        __metadata("design:type", Number)
    ], Payment.prototype, "amount", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Payment.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return customer_entity_1.Customer; }, function (customer) { return customer.payments; }),
        __metadata("design:type", customer_entity_1.Customer)
    ], Payment.prototype, "customer", void 0);
    Payment = __decorate([
        (0, typeorm_1.Entity)()
    ], Payment);
    return Payment;
}());
exports.Payment = Payment;
