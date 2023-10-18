import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Product } from "./product.entity"

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    name: string

    @Column({nullable: false})
    image: string

    @OneToMany(() => Product, (product) => product.category)
    products: Product[]
}