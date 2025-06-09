import { Router } from 'express';
import { getAllProducts, getProduct } from './controller.js';

function logger(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    console.log(req.params);
    next();
}

const productRouter = Router();

productRouter
    .get('/', logger, getAllProducts) 
    .get('/:id', logger, getProduct) 

export default productRouter;



// import { Router } from 'express';

// const productRouter = Router();

// productRouter
//   .get('/', (req, res) => {
//     res.json({ message: 'Tous les produits' });
//   })
//   .get('/:id', (req, res) => {
//     res.json({ message: `Produit avec ID ${req.params.id}` });
//   });

// export default productRouter;
