import io, { Socket } from "socket.io-client";

interface message {
  msg: string;
  color: string;
}

interface config {
  onAuth?: (uuid: string, color: string) => void;
  onMessage?: (data: message[]) => void;
  uuid?: string;
}

export default class MessageManagerMaker {
  socket: Socket;
  uuid: string = null;
  color: string = "000000";
  conf: config;

  constructor(conf: config) {
    this.conf = conf;
    let socket = io();

    socket.on("connect", () => {
      console.log(`Connected! ID: ${socket.id}`);

      if (!conf.uuid) {
        this.newAccount();
      }
    });

    socket.on("msg:receive", (msg: message[]) => {
      conf.onMessage && conf.onMessage(msg);
    });

    this.socket = socket;
  }

  newAccount() {
    this.socket.emit(
      "auth:create",
      (account: { uuid: string; color: string }) => {
        this.uuid = account.uuid;
        this.color = account.color;
        this.conf.onAuth && this.conf.onAuth(this.uuid, this.color);
      }
    );
  }

  sendMessage(msg: string) {
    this.socket.emit("msg:create", {
      uuid: this.uuid,
      msg,
    });
  }
}
