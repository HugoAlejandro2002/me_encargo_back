import { ICaracteristicas } from "../entities/ICaracteristicas";
import { ICaracteristicas_Producto } from "../entities/ICaracteristicas_Producto";
import { IProducto } from "../entities/IProducto";

export class Caracteristicas_Producto{
    //las dos fk
    id_Caracteristica: number;
    id_Producto: number;

    caracteristicas: ICaracteristicas[];
    producto: IProducto[];

    value: string

    constructor(iCaracteristicas_Producto: ICaracteristicas_Producto){
        this.id_Caracteristica = iCaracteristicas_Producto.id_Caracteristica;
        this.id_Producto = iCaracteristicas_Producto.id_Producto;
        this.caracteristicas = iCaracteristicas_Producto.caracteristicas;
        this.producto = iCaracteristicas_Producto.producto;
        this.value = iCaracteristicas_Producto.value
    }
}