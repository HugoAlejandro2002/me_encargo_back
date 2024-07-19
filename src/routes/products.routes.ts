import { Request, Response, Router } from "express";
import { getProduct, getPropertyById, registerProduct } from "../controllers/product.controller";

const productRouter = Router();
productRouter.get('/', getProduct)

productRouter.post('/register', registerProduct)

productRouter.get('/:id', getPropertyById)

export default productRouter;