import { Router } from 'express';
import {
    getWorker, entry,
    getEntries, pause, getEveryEntriesWithWorkers
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
    .post('/getEveryEntriesWithWorkers', logger, getEveryEntriesWithWorkers)
    .post('/getEntries', logger, getEntries)
    .post('/entry', logger, entry)
    .post('/pause', logger, pause)

export default workerRouter;