import { Caracteristicas_ProductoEntity } from "./implements/Caracteristicas_ProductoEntity";


export interface IProducto{
    id_Producto: number;
    nombre_producto: string;
   
    caracteristicasProducto: Caracteristicas_ProductoEntity[];
}