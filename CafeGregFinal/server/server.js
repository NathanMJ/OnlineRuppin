import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
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
const httpServer = createServer(server);

// Configure Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: "*", // À modifier selon vos besoins de sécurité
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Rendre io accessible dans toute l'application
server.set('io', io);

//middleware
server.use(cors())
server.use(morgan('tiny'))

//add support for json and form support
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use((req, res, next) => {
  req.io = io;
  next();
});

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


// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);
  console.log("Nombre total de clients :", io.engine.clientsCount);

  // Le client peut s'abonner à une table spécifique
  socket.on('subscribe:table', (profile, tableId) => {
    socket.join(`profile:${profile}:table:${tableId}`);
    console.log(`Client ${socket.id} du profile ${profile} est abonné à la table ${tableId}`);
  });

  socket.on('unsubscribe:table', (profile, tableId) => {
    socket.leave(`profile:${profile}:table:${tableId}`);
    console.log(`Client ${socket.id} du profile ${profile} est desabonné à la table ${tableId}`);
  });


  // Le client peut se connecter a la cuisine/bar
  socket.on('subscribe:preparation', (destinationId) => {
    socket.join(`preparationRoom:${destinationId}`);
    console.log(`Client ${socket.id} connecte à la preparation ${destinationId}`);
  });


  // Se désabonner d'une cuisine/bar
  socket.on('unsubscribe:preparation', (destinationId) => {
    socket.leave(`preparationRoom:${destinationId}`);
    console.log(`Client ${socket.id} se deconnecte de la preparation ${destinationId}`);
  });

  // S'abonner aux changement des tables
  socket.on('subscribe:main-tables', (profile) => {
    socket.join(`main-tables:${profile}`);
    console.log(`Client ${socket.id} abonné aux changements des tables`);
  });

  // Se désabonner des changement des tables
  socket.on('unsubscribe:main-tables', (profile) => {
    socket.leave(`main-tables:${profile}`);
    console.log(`Client ${socket.id} désabonné des changements des tables`);
  });

  // S'abonner aux changement des tables
  socket.on('subscribe:worker-entries', (workerId) => {
    socket.join(`get-entries:${workerId}`);
    console.log(`Client ${socket.id} abonné aux changements des entrees du worker ${workerId}`);
  });

  // Se désabonner des changement des tables
  socket.on('unsubscribe:worker-entries', (workerId) => {
    socket.leave(`get-entries:${workerId}`);
    console.log(`Client ${socket.id} désabonné des changements des entrees du worker ${workerId}`);
  });

  // S'abonner aux changement de travailleurs qui travaillent
  socket.on('subscribe:manager:worker', () => {
    socket.join(`get-workers-entries`);
    console.log(`Client ${socket.id} abonné aux changements des entrees des worker`);
  });

  // Se désabonner aux changement de travailleurs qui travaillent
  socket.on('unsubscribe:manager:worker', () => {
    socket.leave(`get-workers-entries`);
    console.log(`Client ${socket.id} désabonné des changements des entrees des worker`);
  });

  //S'abonner aux profile pour les tokens
  socket.on('subscribe:profile', (profile) => {
    socket.join(`profile:${profile}`);
    console.log(`Client ${socket.id} abonné aux profile ${profile} pour les tokens`);
  })

  //Se desabonner aux profile pour les tokens
  socket.on('unsubscribe:profile', (profile) => {
    socket.leave(`profile:${profile}`);
    console.log(`Client ${socket.id} désabonné au profile ${profile} pour les tokens`);
  })

  socket.on('broadcast:allTables', (message) => {
    for (const [id, room] of io.sockets.adapter.rooms) {
      if (id.startsWith("table:")) {
        io.to(id).emit("every-table:update", { message })
      }
    }
  })

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });

});

//start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export { io };


