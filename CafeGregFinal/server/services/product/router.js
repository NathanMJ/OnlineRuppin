import { Router } from 'express';
import { getAllProducts, getProduct } from './controller.js';
import { logger } from '../../middlewares/logger.js'

const productRouter = Router();

productRouter
    .get('/', logger, getAllProducts) 
    .get('/:id', logger, getProduct) 

export default productRouter;


