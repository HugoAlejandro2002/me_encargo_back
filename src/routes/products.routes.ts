import { Request, Response, Router } from "express";
import { addFeatureToProduct, addStockToBranch, getFeatures, getProduct, getProductById, getProductCategory, ProductController, registerProduct } from "../controllers/product.controller";

const productRouter = Router();
productRouter.get('/', getProduct)

productRouter.post('/register', ProductController.registerProductVariants)

productRouter.post('/addFeatures', addFeatureToProduct)

productRouter.post('/addStock', addStockToBranch)

productRouter.get('/features/:id', getFeatures)

productRouter.get('/category/:id', getProductCategory)

productRouter.get('/:id', getProductById)

export default productRouter;