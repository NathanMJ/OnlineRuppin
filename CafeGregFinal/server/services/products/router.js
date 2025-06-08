import { Router } from 'express';
import { getAllProducts, getProduct } from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    console.log(req.params);
    next();
}

const productRouter = Router();

productRouter
    .get('/', logger, getAllProducts) 
    .get('/:id', logger, getProduct) 

export default productRouter;