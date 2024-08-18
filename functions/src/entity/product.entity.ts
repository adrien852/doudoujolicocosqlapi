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

    @Column("simple-array", { nullable: false })
    images: string[]

    @Column('decimal', { precision: 6, scale: 2 , nullable: false})
    price: number

    @Column('decimal', { precision: 6, scale: 2 , nullable: false})
    originalPrice: number

    @Column({nullable: false})
    description: string

    @Column({nullable: true})
    material: string

    @Column({nullable: true})
    dimensions: string

    @Column({nullable: false})
    isNotForChildren: boolean

    @ManyToOne(() => Category, (category) => category.products, {
        eager: true,
        nullable: false
    })
    category: Category

    @Column({nullable: false})
    stock: number

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: "CURRENT_TIMESTAMP"})
    modifiedAt: Date;
}