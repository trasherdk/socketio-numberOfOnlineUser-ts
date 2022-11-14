import express from "express";
import * as http from "http";
import { SocketService } from "./services"; // We import our SocketService, Thanks to the index.ts file, we don't need to specify where exactly the Socket.ts file is located.
import cors from "cors";

const app = express();
const server = http.createServer(app);
const port = 3000;
const socketService = new SocketService(server); // We instantiate our SocketService

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

socketService.listenStore(); // We ask to our service to listen the change of the "Observable" data and emit the change to our socket by the "dataChange" event.

socketService.listenUserActivity(); // We listen the activity of the socket and change the state of the "Observable" data when a desired event is triggered ("connection" or "disconnect")

server.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
