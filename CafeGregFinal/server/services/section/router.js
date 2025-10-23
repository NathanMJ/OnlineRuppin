import { Router } from 'express';
import { getBySection, getPreviousSections } from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    next();
}

const sectionRouter = Router();

sectionRouter
    .post('/', logger, getBySection) 
    .get('/previous/:id', logger, getPreviousSections) 

export default sectionRouter;