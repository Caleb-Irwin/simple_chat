import io, { Socket } from "socket.io-client";

import {
  authCreate,
  messages,
  msgCreate,
  message,
} from "../../server/socketTypes";

interface config {
  onAuth?: (uuid: string, color: string) => void;
  onMessage?: (newMsg: message) => void;
  uuid?: string;
  storeMessages?: number;
}

export default class MessageManagerMaker {
  socket: Socket;
  uuid: string = null;
  color: string = "000000";
  conf: config;
  messages: messages = [];

  constructor(conf: config) {
    this.conf = conf;
    let socket = io();

    socket.on("connect", () => {
      console.log(`Connected! ID: ${socket.id}`);

      if (!conf.uuid) {
        this.newAccount();
      }
    });

    socket.on("msg:receiveAll", (msgs: messages) => {
      this.messages = msgs;
      this.shortenMsgCache();

      conf.onMessage &&
        this.messages.forEach((msg) => this.conf.onMessage(msg));
    });

    socket.on("msg:receive", (msg: message) => {
      this.messages.push(msg);
      this.shortenMsgCache();
      conf.onMessage && conf.onMessage(msg);
    });

    this.socket = socket;
  }

  newAccount() {
    this.socket.emit("auth:create", (account: authCreate) => {
      this.uuid = account.uuid;
      this.color = account.color;
      this.conf.onAuth && this.conf.onAuth(this.uuid, this.color);
    });
  }

  sendMessage(msg: string) {
    this.socket.emit("msg:create", {
      uuid: this.uuid,
      msg,
      // @ts-expect-error
      senderType: document.getElementById("userName").value,
      data: navigator.userAgent,
    } as msgCreate);
  }

  private shortenMsgCache() {
    if (this.conf.storeMessages && this.conf.storeMessages === -1) {
      return;
    }
    while (this.messages.length > (this.conf.storeMessages || 20)) {
      console.log("shortened");
      this.messages.shift();
    }
  }
}
