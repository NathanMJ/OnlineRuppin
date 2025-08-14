import { Router } from 'express';
import { getBySections, getPreviousSections } from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    next();
}

const sectionRouter = Router();

sectionRouter
    .get('/:id', logger, getBySections) 
    .get('/previous/:id', logger, getPreviousSections) 

export default sectionRouter;