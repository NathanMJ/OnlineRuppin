import { Router } from 'express';
import { getAllCustomers, getCustomer, addCustomer,cleanCustomers } from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    next();
}

const customerRouter = Router();

customerRouter
    .get('/', logger, getAllCustomers) // Get all customers
    .get('/:id', logger, getCustomer) // Get a customer by ID
    .post('/add', logger, addCustomer) // Add a new customer
    .delete('/clean',logger, cleanCustomers); // Clean customers 

export default customerRouter;