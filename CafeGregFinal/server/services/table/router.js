import { Router } from 'express';
import { getAllTables, getTable } from './controller.js';

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

export default tableRouter;