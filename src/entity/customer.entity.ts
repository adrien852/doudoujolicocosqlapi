import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from "typeorm"
import { Product } from "./product.entity"
import { Address } from "./address.entity"
import { Payment } from "./payment.entity"

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Address)
    @JoinColumn()
    shippingAddress: Address

    @OneToOne(() => Address)
    @JoinColumn()
    billingAddress: Address

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[]

    @OneToMany(() => Payment, (payment) => payment.customer)
    payments: Payment[]
}