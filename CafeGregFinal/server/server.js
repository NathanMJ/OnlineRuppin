import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import customerRouter from './services/customer/router.js';
import productRouter from './services/product/router.js';
import tableRouter from './services/table/router.js';
import ingredientRouter from './services/ingredient/router.js';
import orderRouter from './services/order/router.js';
import sectionRouter from './services/section/router.js';
import statusRouter from './services/status/router.js';
import workerRouter from './services/worker/router.js';
import websiteRouter from './services/website/router.js';

//set server port
const PORT = process.env.PORT || 5500

//create server instance
const server = express()

//middleware
server.use(cors())
server.use(morgan('tiny'))

//add support for json and form support
server.use(express.json())
server.use(express.urlencoded({ extended: true }))


//add microservices routes here
server.use('/api/customer', customerRouter)
server.use('/api/product', productRouter)
server.use('/api/table', tableRouter)
server.use('/api/ingredient', ingredientRouter)
server.use('/api/order', orderRouter)
server.use('/api/section', sectionRouter)
server.use('/api/status', statusRouter)
server.use('/api/worker', workerRouter)
server.use('/api/website', websiteRouter)



//start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})




