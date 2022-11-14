import * as socketio from "socket.io";
import * as http from "http"; // Just for typing, we like typing !
import { BehaviorSubject, Observable } from "rxjs";

import { NumberOFUser } from "../models/Socket"; // Here our model, cause we like typing things !

export class SocketService {
  private numberOfUser: BehaviorSubject<NumberOFUser> =
    new BehaviorSubject<NumberOFUser>({
      data: 0,
    }); // Here our "stream pipe" of the NumberOfUser Data.
  private numberOfUser$: Observable<NumberOFUser> =
    this.numberOfUser.asObservable(); // Here's our "Observable" data.

  private io!: socketio.Server; // Our Socket instance

  constructor(server: http.Server) {
    this.io = new socketio.Server(server, { cors: { origin: "*" } }); // We init our Socket instance with the server as parameter
  }

  public listenStore() {
    this.numberOfUser$.subscribe((store) => {
      // subscribe is called at each store value change !
      this.io.emit("numberOfUser", store.data); // So at each value change, we emit this value to the client with the event name "numberOfUser"
    });
  }

  public listenUserActivity() {
    this.io.on("connection", (client) => {
      const storeData = this.numberOfUser.getValue();
      // When a user do a connection at our socket, the "connection" event is called. It's a default event from socket.io.
      this.numberOfUser.next({
        data: this.numberOfUser.value.data + 1, // we get the actual value of our "Observable" and
      }); // we change the data with the function "next"

      client.once("disconnect", () => {
        // When a user do a disconnection, the "disconnect" event is called. It's a default event from socket.io.
        this.numberOfUser.next({
          data: this.numberOfUser.value.data - 1,
        }); // You know what next do now.
      });
    });
  }
}
