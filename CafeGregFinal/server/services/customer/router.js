import { Router } from 'express';
import { getAllCustomers, getCustomer, addCustomer, registerCustomer,loginCustomer, disconnectCustomer,getHistory} from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    next();
}

const customerRouter = Router();

customerRouter
    .get('/', logger, getAllCustomers) 
    .get('/history', logger, getHistory)
    .get('/:id', logger, getCustomer) 
    .post('/register/:tableId', logger, registerCustomer)
    .post('/login/:tableId', logger, loginCustomer)
    .post('/disconnect', logger, disconnectCustomer)
    .post('/add', logger, addCustomer) 

export default customerRouter;