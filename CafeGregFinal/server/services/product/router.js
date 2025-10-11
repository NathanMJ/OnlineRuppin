import { Router } from 'express';
import { changeProduct, getAllProducts, getProduct, getProductsByName } from './controller.js';
import { logger } from '../../middlewares/logger.js'

const productRouter = Router();

productRouter
    .get('/', logger, getAllProducts) 
    .get('/:id', logger, getProduct) 
    .get('/byName/:research', logger, getProductsByName) 
    .post('/changeProduct', logger, changeProduct)

export default productRouter;


