import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { Category } from "./category.entity"

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    name: string

    @Column("simple-array")
    images: string[]

    @Column({ nullable: false })
    price: number

    @Column({nullable: false})
    description: string

    @ManyToOne(() => Category, (category) => category.products)
    category: Category
}