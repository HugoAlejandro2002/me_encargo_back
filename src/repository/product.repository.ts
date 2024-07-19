import { Producto } from "../models/Producto";
import AppDataSource from '../config/dataSource';
import { ProductoEntity } from '../entities/implements/ProductoEntity';
import { IProducto } from "../entities/IProducto";
import { ICaracteristicas } from "../entities/ICaracteristicas";
import { CaracteristicasEntity } from "../entities/implements/CaracteristicasEntity";
import { Caracteristicas_ProductoEntity } from "../entities/implements/Caracteristicas_ProductoEntity";

const productRepository = AppDataSource.getRepository(ProductoEntity);
const factsRepository = AppDataSource.getRepository(CaracteristicasEntity)
const productoCaracteristicaRepository = AppDataSource.getRepository(Caracteristicas_ProductoEntity)

const getFeatures = async(id: number): Promise<any> => {
    const producto: ProductoEntity = (await productRepository.findOneBy({id_Producto: id}))!
    return await productoCaracteristicaRepository.find({
      where:{
        producto 
      },
      relations:{
        caracteristica: true
      }
    })
}

const findAll = async (): Promise<Producto[]> => {
    return await productRepository.find({
        relations:{
            caracteristicasProducto: true
        }
    })
}
const registerProduct = async (product: IProducto, facts: ICaracteristicas): Promise<Producto> => {
    const newFacts = factsRepository.create(facts);
    const savedFacts = await factsRepository.save(newFacts)
    const newProduct = productRepository.create(product);
    const savedProduct = await productRepository.save(newProduct);
    return new Producto(savedProduct);
}

export const ProductRepository = {
    findAll,
    registerProduct,
    getFeatures
};