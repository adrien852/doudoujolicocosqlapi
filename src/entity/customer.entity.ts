import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from "typeorm"
import { Product } from "./product.entity"
import { Address } from "./address.entity"
import { Payment } from "./payment.entity"

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    email: string

    @OneToOne(() => Address, {
        cascade: true,
    })
    @JoinColumn()
    shippingAddress: Address

    @OneToOne(() => Address, {
        cascade: true,
    })
    @JoinColumn()
    billingAddress: Address

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[]

    @OneToMany(() => Payment, (payment) => payment.customer)
    payments: Payment[]
}