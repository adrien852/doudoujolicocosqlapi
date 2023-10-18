import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm"
import { Category } from "./category.entity"
import { Customer } from "./customer.entity"

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    paymentId: string

    @Column({nullable: false})
    amount: string

    @Column({type: "datetime", nullable: false})
    createdAt: string

    @ManyToOne(() => Customer, (customer) => customer.payments)
    customer: Customer
}