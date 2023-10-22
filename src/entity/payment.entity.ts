import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm"
import { Customer } from "./customer.entity"

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    paymentId: string

    @Column('decimal', { precision: 6, scale: 2 , nullable: false})
    amount: number

    @Column({type: "datetime", nullable: false})
    createdAt: string

    @ManyToOne(() => Customer, (customer) => customer.payments)
    customer: Customer
}