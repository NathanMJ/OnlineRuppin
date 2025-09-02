import { Router } from 'express';
import { changeStatus, getOrder, removeOrder,getOrderPrice} from './controller.js';
import { logger } from '../../middlewares/logger.js'

const orderRouter = Router();

orderRouter
    .get('/:id', logger, getOrder) 
    .get('/:id/price', logger, getOrderPrice) 
    .post('/remove/:id', logger, removeOrder) 
    .post('/changeOrderStatus/:id/:status', logger, changeStatus) 

export default orderRouter;


