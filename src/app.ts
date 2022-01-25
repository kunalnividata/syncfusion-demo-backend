import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { getSampleData, generateJsonFile, editColumn, addColumn } from './getData';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const port = 3000;

generateJsonFile();

io.on('connection', (socket) => {

  socket.on('editCol', (formData) => editColumn(formData, socket));

  socket.on('addNewCol', (formData) => addColumn(formData, socket));
})

app.get('/get-data', getSampleData);

server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});