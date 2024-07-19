import { ProductRepository } from "../repository/product.repository";

const getAllProducts = async () => {
    return await ProductRepository.findAll();
};

const registerProduct = async (product: any, facts: any) => {
    return await ProductRepository.registerProduct(product,facts);
};

const getPropertiesById = async (productId: number) => {
    const featuers = await ProductRepository.getFeatures(productId)
    return featuers
}

export const ProductService ={
    getAllProducts,
    registerProduct,
    getPropertiesById
}