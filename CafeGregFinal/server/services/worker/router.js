import { Router } from 'express';
import {
    getWorker
} from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    console.log(req.params);
    next();
}

const workerRouter = Router();

workerRouter
    .get('/:id', logger, getWorker)

export default workerRouter;