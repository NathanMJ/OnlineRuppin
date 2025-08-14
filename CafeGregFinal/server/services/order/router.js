import { Router } from 'express';
import { changeStatus, getOrder, removeOrder } from './controller.js';
import { logger } from '../../middlewares/logger.js'

const orderRouter = Router();

orderRouter
    .get('/:id', logger, getOrder) 
    .post('/remove/:id', logger, removeOrder) 
    .post('/changeOrderStatus/:id/:status', logger, changeStatus) 

export default orderRouter;


