import { inject, injectable } from "inversify";
import { Server } from "socket.io";

@injectable()
export class Listeners {
  constructor() {}
  setServer(io: Server) {
    io.on("connection", (socket) => {
      console.log("a user connected", socket.id);
      socket.emit("something-changes", { message: "hello" });
      socket.on("disconnect", (socket) => {
        console.log(`user ${socket} disconnected`);
      });
    });
  }
}
