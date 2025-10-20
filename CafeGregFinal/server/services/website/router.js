import { Router } from 'express';
import { connect, addToken, getToken} from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    next();
}

const websiteRouter = Router();

websiteRouter
    .post('/connect', logger, connect) 
    .post('/addToken', logger, addToken) 
    .post('/getToken', logger, getToken) 

export default websiteRouter;