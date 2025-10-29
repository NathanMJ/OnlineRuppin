import { Router } from 'express';
import { changeProduct, getAllProducts, getProduct, getProductsByName } from './controller.js';
import { logger } from '../../middlewares/logger.js'

const productRouter = Router();

productRouter
    .post('/byId', logger, getProduct)
    .post('/byName', logger, getProductsByName)
    .get('/all', logger, getAllProducts)
    .post('/changeProduct', logger, changeProduct)

export default productRouter;


