import { Router } from "express";
import { GroupController } from "../controllers/group.controller";


const groupRouter = Router()

groupRouter.get('/:id/variants', GroupController.getProductsInGroup)

groupRouter.get('/', GroupController.getAllGroups)

groupRouter.put('/products/:id', GroupController.updateGroupAndProductNames)

export default groupRouter