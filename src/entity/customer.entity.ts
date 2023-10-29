import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm"
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
        eager: true
    })
    @JoinColumn()
    shippingAddress: Address

    @OneToOne(() => Address, {
        cascade: true,
    })
    @JoinColumn()
    billingAddress: Address

    @OneToMany(() => Payment, (payment) => payment.customer)
    payments: Payment[]
}