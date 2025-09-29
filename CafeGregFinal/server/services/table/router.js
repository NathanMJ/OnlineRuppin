import { Router } from 'express';
import {
    addTable, getAllTables, getTable, addOrder, getOrders,
    getCustomersOfTable, getPriceOfTable, removeTable, changeStatus,
    payTable,
    switchTables
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
    .post('/:id/payTable/:tipValue', logger, payTable)
    .post('/:id/status/:statusId', logger, changeStatus)
    .post('/:id/order', logger, addOrder)
    .post('/:id/switchWith/:id2', logger, switchTables)
    .delete('/:id/delete', logger, removeTable)

export default tableRouter;