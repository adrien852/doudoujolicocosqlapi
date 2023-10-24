import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn } from "typeorm"
import { Customer } from "./customer.entity"

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    paymentId: string

    @Column('decimal', { precision: 6, scale: 2 , nullable: false})
    amount: number

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Customer, (customer) => customer.payments)
    customer: Customer
}