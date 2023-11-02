import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from "typeorm"
import { Category } from "./category.entity"

@Entity()
@Index(['normalized'], {unique: true})
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    name: string

    @Column({nullable: false})
    normalized: string

    @Column("simple-array")
    images: string[]

    @Column({ nullable: false })
    price: number

    @Column({nullable: false})
    description: string

    @ManyToOne(() => Category, (category) => category.products, {
        eager: true,
    })
    category: Category
}