import { Router } from 'express';
import { changeStatus, getOrder, removeOrder,getOrderPrice, getOrdersFromDestination} from './controller.js';
import { logger } from '../../middlewares/logger.js'

const orderRouter = Router();

orderRouter
    .post('/byId', logger, getOrder) 
    .post('/removeById', logger, removeOrder) 
    .post('/changeOrderStatus', logger, changeStatus) 
    .get('/:id/price', logger, getOrderPrice) 
    .get('/fromDestination/:destination', logger, getOrdersFromDestination) 

    
export default orderRouter;


