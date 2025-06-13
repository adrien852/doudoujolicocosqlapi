import { Entity, JoinColumn, PrimaryGeneratedColumn, OneToOne } from "typeorm"
import { Promo } from "./promo.entity"

@Entity()
export class Home {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => Promo, { nullable: true })
    @JoinColumn()
    promo: Promo
}