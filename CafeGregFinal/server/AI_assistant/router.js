import { Router } from 'express';
import { getHelp  } from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    console.log(req.params);
    next();
}

const AIRouter = Router();

AIRouter
    .post('/ask', logger, getHelp)

export default AIRouter;