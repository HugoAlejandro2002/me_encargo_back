import { Entity, PrimaryColumn,  Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany } from 'typeorm';
import { ICaracteristicas_Producto } from "../ICaracteristicas_Producto";
import { IProducto } from "../IProducto";
import { Caracteristicas_ProductoEntity } from './Caracteristicas_ProductoEntity';
import { CaracteristicasEntity } from './CaracteristicasEntity';

@Entity({name:'Producto'})
export class ProductoEntity implements IProducto{
    
    @PrimaryGeneratedColumn()
    id_Producto!: number;
    
    @Column({type: 'varchar'})
    nombre_producto!: string;

    @OneToMany(() => Caracteristicas_ProductoEntity, caracteristicaProducto => caracteristicaProducto.producto)
    caracteristicasProducto!: Caracteristicas_ProductoEntity[];

}