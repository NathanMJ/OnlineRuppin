import { Router } from 'express';
import { changeProduct, getAllProducts, getProduct, getProductsByName } from './controller.js';
import { logger } from '../../middlewares/logger.js'

const productRouter = Router();

productRouter
    .post('/', logger, getProduct)
    .get('/all', logger, getAllProducts)
    .get('/byName/:research', logger, getProductsByName)
    .post('/changeProduct', logger, changeProduct)

export default productRouter;


