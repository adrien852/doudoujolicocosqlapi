import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "./product.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
    order: Order;

    @ManyToOne(() => Product, { eager: true })
    product: Product;

    @Column({ 
        type: 'int', 
        default: 1 
    })
    quantity: number;
}