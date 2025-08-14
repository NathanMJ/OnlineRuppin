import { Router } from 'express';
import { addTable, getAllTables, getTable, addOrder, getOrders} from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    console.log(req.params);
    next();
}

const tableRouter = Router();

tableRouter
    .get('/', logger, getAllTables)
    .get('/:id', logger, getTable)
    .get('/:id/getOrders', logger, getOrders)
    .post('/:id/addTable', logger, addTable)
    .post('/:id/order', logger, addOrder)

export default tableRouter;