import { IProducto } from './../entities/IProducto';
import { ICaracteristicas_Producto } from "../entities/ICaracteristicas_Producto";

export class Producto{
    id_Producto: number;
    nombre_producto: string;
    caracteristicasProducto: ICaracteristicas_Producto[];

    constructor(iProducto: IProducto){
        this.id_Producto = iProducto.id_Producto
        this.nombre_producto = iProducto.nombre_producto
        this.caracteristicasProducto= iProducto.caracteristicasProducto;
    }
}