import { Router } from 'express';
import { getIngredient } from './controller.js';
import { logger } from '../../middlewares/logger.js'

const ingredientRouter = Router();

ingredientRouter
    .get('/:id', logger, getIngredient) 

export default ingredientRouter;


