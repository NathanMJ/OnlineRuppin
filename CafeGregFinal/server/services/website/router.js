import { Router } from 'express';
import { connect} from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    next();
}

const websiteRouter = Router();

websiteRouter
    .post('/connect', logger, connect) 

export default websiteRouter;