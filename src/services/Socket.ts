import * as socketio from "socket.io";
import * as http from "http"; // Just for typing, we like typing !
import { BehaviorSubject } from "rxjs";

import { SocketData } from "../models/Socket"; // Here our model, cause we like typing things !

export class SocketService {
  private store: BehaviorSubject<SocketData> = new BehaviorSubject<SocketData>({
    numberOfUser: 0,
  }); // Here's our "Observable" data.
  private io!: socketio.Server; // Our Socket instance

  constructor(server: http.Server) {
    this.io = new socketio.Server(server, { cors: { origin: "*" } }); // We init our Socket instance with the server as parameter
  }

  public listenStore() {
    this.store.subscribe((store) => {
      // subscribe is called at each store value change !
      this.io.emit("dataChange", store); // So at each value change, we emit this value to the client with the event name "dataChange"
    });
  }

  public listenUserActivity() {
    this.io.on("connection", (client) => {
      const storeData = this.store.getValue(); // we get the actual value of our "Observable"
      // When a user do a connection at our socket, the "connection" event is called. It's a default event from socket.io.
      this.store.next({ numberOfUser: storeData.numberOfUser + 1 }); // so we change the data of the store with the function "next"
      client.once("disconnect", () => {
        const storeData = this.store.getValue(); // we get the actual value of our "Observable"
        // When a user do a disconnection, the "disconnect" event is called. It's a default event from socket.io.
        if (storeData.numberOfUser !== 0) {
          // A check just by security.
          this.store.next({ numberOfUser: storeData.numberOfUser - 1 }); // You know what next do now.
        }
      });
    });
  }
}
