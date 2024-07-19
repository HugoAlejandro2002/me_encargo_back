import { Entity, PrimaryColumn,  Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ICaracteristicas } from "../ICaracteristicas";
import { ICaracteristicas_Producto } from "../ICaracteristicas_Producto";
import { IProducto } from "../IProducto";
import { ProductoEntity } from './ProductoEntity';
import { CaracteristicasEntity } from './CaracteristicasEntity';

@Entity({name:'Caracteristicas_Producto'})
export class Caracteristicas_ProductoEntity implements ICaracteristicas_Producto{
    @PrimaryGeneratedColumn()
    public caracteristicaProductoId!: number

    @Column()       
    public value!: string

    @ManyToOne( () => CaracteristicasEntity, (caracteristica) => caracteristica.caracteristicaProducto)
    @JoinColumn({
        name: "car_id",
        referencedColumnName: "id_Caracteristicas",
        foreignKeyConstraintName: "fk_car_id"
    })
    caracteristica!: CaracteristicasEntity

    @ManyToOne( () => ProductoEntity, (producto) => producto.caracteristicasProducto)
    @JoinColumn({
        name: "prod_id",
        referencedColumnName: "id_Producto",
        foreignKeyConstraintName: "fk_prod_id"
    })
    producto!: ProductoEntity
}