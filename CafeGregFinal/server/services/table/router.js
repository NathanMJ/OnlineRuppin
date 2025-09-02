import { Router } from 'express';
import {
    addTable, getAllTables, getTable, addOrder, getOrders,
    getCustomersOfTable, getPriceOfTable, removeTable, changeStatus,
    payTable
} from './controller.js';

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
    .get('/:id/customers', logger, getCustomersOfTable)
    .get('/:id/priceOfTable', logger, getPriceOfTable)
    .post('/:id/addTable', logger, addTable)
    .post('/:id/payTable', logger, payTable)
    .post('/:id/status/:statusId', logger, changeStatus)
    .post('/:id/order', logger, addOrder)
    .delete('/:id/delete', logger, removeTable)

export default tableRouter;