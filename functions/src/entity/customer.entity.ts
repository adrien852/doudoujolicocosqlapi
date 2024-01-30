import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { Address } from "./address.entity"
import { Payment } from "./payment.entity"
import { Order } from "./order.entity"

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    email: string

    @Column({nullable: true})
    password: string

    @OneToOne(() => Address, {
        cascade: true,
        eager: true
    })
    @JoinColumn()
    shippingAddress: Address

    @OneToMany(() => Payment, (payment) => payment.customer)
    payments: Payment[]

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[]
}