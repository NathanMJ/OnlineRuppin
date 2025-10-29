import { Router } from 'express';
import { getStatusOfOrder, getEveryStatus} from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    console.log(req.params);
    next();
}

const statusRouter = Router();

statusRouter
    .post('/byOrderId', logger, getStatusOfOrder)
    .get('/', logger, getEveryStatus)

export default statusRouter;