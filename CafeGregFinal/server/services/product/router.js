import { Router } from 'express';
import { getAllProducts, getProduct, getProductsByName } from './controller.js';
import { logger } from '../../middlewares/logger.js'

const productRouter = Router();

productRouter
    .get('/', logger, getAllProducts) 
    .get('/:id', logger, getProduct) 
    .get('/byName/:research', logger, getProductsByName) 

export default productRouter;


