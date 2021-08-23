import io, { Socket } from "socket.io-client";

interface message {
  msg: string;
  color: string;
}

export default class MessageManagerMaker {
  socket: Socket;

  constructor(handleMessages: (data: message[]) => void) {
    let socket = io();

    socket.on("connect", () => {
      console.log(`Connected! ID: ${socket.id}`);
    });

    socket.on("msg", (msg: message[]) => {
      handleMessages(msg);
    });

    this.socket = socket;
  }

  sendMessage(msg: string, uuid: string) {
    this.socket.emit("msg", {
      uuid,
      msg,
    });
  }
}
