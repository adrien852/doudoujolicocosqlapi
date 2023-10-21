import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    firstName: string

    @Column({nullable: false})
    lastName: string

    @Column({nullable: false})
    city: string

    @Column({nullable: false})
    postalCode: string

    @Column({nullable: false})
    address1: string

    @Column({nullable: true})
    address2: string

    @Column({nullable: false})
    phone: string
}