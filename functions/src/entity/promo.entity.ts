import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from "typeorm"
import { Order } from "./order.entity"

export enum PromoType {
    FIXED = "Valeur fixe",
    PERCENTAGE = "Pourcentage",
}

@Entity()
@Index(['code'], {unique: true})
export class Promo {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    code: string

    @Column('decimal', { precision: 6, scale: 2 , nullable: false})
    amount: number

    @Column({
        type: "enum",
        enum: PromoType,
        default: PromoType.PERCENTAGE
    })
    type: PromoType

    @Column('decimal', { precision: 6, scale: 2 , default: 0})
    minimumOrderTotal: number

    @Column({default: true})
    active: boolean

    @OneToMany(() => Order, (order) => order.promo)
    orders: Order[]
}