import { ICaracteristicas } from "../entities/ICaracteristicas";
import { ICaracteristicas_Producto } from "../entities/ICaracteristicas_Producto";
import { IProducto } from "../entities/IProducto";

export class Caracteristicas_Producto{

    value: string

    constructor(iCaracteristicas_Producto: ICaracteristicas_Producto){
        this.value = iCaracteristicas_Producto.value
    }
}