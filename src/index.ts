import { Socket } from "socket.io";
import http from "http";
import express from 'express';
import { Server } from 'socket.io';
import { UserManager } from "./managers/UserManger";
import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  console.log('Running a task every minute');
});

const app = express();

app.get("/", (req, res) => {
  res.send("healthy server");
});

const server = http.createServer(app); // Use 'app' instead of 'http'

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const userManager = new UserManager();

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  userManager.addUser("randomName", socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userManager.removeUser(socket.id);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
