import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, JoinTable, ManyToMany } from "typeorm"
import { Customer } from "./customer.entity"
import { Product } from "./product.entity"

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    paymentId: string

    @Column('decimal', { precision: 6, scale: 2 , nullable: false})
    amount: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ManyToOne(() => Customer, (customer) => customer.payments, {
        eager: true,
    })
    customer: Customer
}