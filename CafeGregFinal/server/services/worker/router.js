import { Router } from 'express';
import {
    getWorker,entry,
    getEntries
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
    .post('/getEntries', logger, getEntries)
    .post('/entry', logger, entry)

export default workerRouter;