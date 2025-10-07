import { Router } from 'express';
import { changeStatus, getOrder, removeOrder,getOrderPrice, getOrdersFromDestination} from './controller.js';
import { logger } from '../../middlewares/logger.js'

const orderRouter = Router();

orderRouter
    .get('/:id', logger, getOrder) 
    .get('/:id/price', logger, getOrderPrice) 
    .get('/fromDestination/:destination', logger, getOrdersFromDestination) 
    .post('/remove/:id', logger, removeOrder) 
    .post('/changeOrderStatus/:id/:status/:tableId/:destinationId', logger, changeStatus) 

export default orderRouter;


