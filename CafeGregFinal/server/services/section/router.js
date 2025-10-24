import { Router } from 'express';
import { getBySection, getPreviousIdSectionsById } from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    next();
}

const sectionRouter = Router();

sectionRouter
    .post('/', logger, getBySection) 
    .post('/previousId', logger, getPreviousIdSectionsById) 

export default sectionRouter;