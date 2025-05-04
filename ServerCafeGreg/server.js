import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import customerRouter from './services/customer/router.js';

//set server port
const PORT = 5500

//create server instance
const server = express()

//middleware
server.use(cors())
server.use(morgan('tiny'))

//add support for json and form support
server.use(express.json())
server.use(express.urlencoded({extended: true}))


//TODO : add microservices routes here
server.use('/api/customer', customerRouter)

//start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
