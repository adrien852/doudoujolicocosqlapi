import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, JoinTable, ManyToMany, JoinColumn, OneToOne } from "typeorm"
import { Customer } from "./customer.entity"
import { Product } from "./product.entity"
import { Payment } from "./payment.entity"

export enum OrderStatus {
    PENDING = "En attente",
    IN_PROGRESS = "En traitement",
    SHIPPED = "Expédié",
    DELIVERED = "Livré"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    reference: string

    @OneToOne(() => Payment, {
        eager: true,
    })
    @JoinColumn()
    payment: Payment

    @ManyToOne(() => Customer, (customer) => customer.orders, {
        eager: true,
        nullable: false
    })
    customer: Customer

    @ManyToMany(() => Product, {
        eager: true,
    })
    @JoinTable()
    products: Product[]

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: "CURRENT_TIMESTAMP"})
    modifiedAt: Date;
}