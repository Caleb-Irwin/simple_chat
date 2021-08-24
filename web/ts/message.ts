import io, { Socket } from "socket.io-client";

interface message {
  msg: string;
  color: string;
}

type onAuthType = (uuid: string, color: string) => void;

export default class MessageManagerMaker {
  socket: Socket;
  uuid: string = null;
  color: string = "000000";
  onAuth: (uuid: string, color: string) => void = () => {};

  constructor(
    handleMessages: (data: message[]) => void,
    onAuth?: onAuthType,
    id?: string
  ) {
    this.onAuth = onAuth;
    let socket = io();

    socket.on("connect", () => {
      console.log(`Connected! ID: ${socket.id}`);

      if (!id) {
        this.newAccount();
      }
    });

    socket.on("msg:receive", (msg: message[]) => {
      handleMessages(msg);
    });

    this.socket = socket;
  }

  newAccount() {
    this.socket.emit(
      "auth:create",
      (account: { uuid: string; color: string }) => {
        this.uuid = account.uuid;
        this.color = account.color;
        this.onAuth(this.uuid, this.color);
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
