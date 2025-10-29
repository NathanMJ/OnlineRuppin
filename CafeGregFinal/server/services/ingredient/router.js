import { Router } from 'express';
import { getIngredient } from './controller.js';
import { logger } from '../../middlewares/logger.js'

const ingredientRouter = Router();

ingredientRouter
    .post('/byId', logger, getIngredient) 

export default ingredientRouter;


