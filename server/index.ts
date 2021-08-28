import { createServer } from "http";
import express from "express";
import { v4 } from "uuid";
import { Server } from "socket.io";
import compression from "compression";

import { msgCreate, messages, message, authCreate } from "./socketTypes";

const app = express();
const server = createServer(app);

const port = 8080;

interface stateInterface {
  users: { [uuid: string]: string };
  messages: messages;
}

let state: stateInterface = {
  users: {},
  messages: [],
};

app.use(compression());
app.use(express.static("../web/dist/"));
app.use(express.json());

app.get("/api/messages", (req, res) => {
  res.send(JSON.stringify(state.messages));
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`> a user connected (${socket.id})`);
  socket.emit("msg:receiveAll", state.messages);

  socket.on("auth:create", (callback: (auth: authCreate) => void) => {
    let uuid = v4();
    let color = "";
    while (color.length !== 6) {
      color = Math.floor(Math.random() * 16777215).toString(16);
    }
    state.users[uuid] = color;
    console.log(`* New User (${uuid}, #${color})`);
    callback({ uuid, color });
  });

  socket.on("msg:create", (msg: msgCreate) => {
    console.log(
      `| ${msg.senderType || "Anonymous"} #${state.users[msg.uuid]} "${
        msg.msg
      }" (${msg.uuid})`
    );

    function sendError(text: string) {
      let msg: message = {
        color: "000000",
        message: "Error! " + text,
        senderType: "Server",
      };
      socket.emit("msg:receive", msg);
    }

    if (!state.users[msg.uuid]) {
      sendError("Unauthorized (401)");
      console.log("! Unauthorized (401)");
      return;
    }
    if (!msg.msg || msg.msg.length === 0) {
      sendError("Bad Request (400)");
      console.log("! Bad Request (400)");
      return;
    }
    if (
      msg.senderType &&
      (msg.senderType.startsWith("server") ||
        msg.senderType.startsWith("Server"))
    ) {
      sendError("Bad User Name (Don't impersonate the Server)");
      console.log(
        `! Tried to send message from "server" or "Server" ("${msg.senderType}")`
      );
      return;
    }
    let newMessage = {
      color: state.users[msg.uuid],
      message: msg.msg,
      senderType: msg.senderType || "Anonymous",
      data: msg.data,
    };
    state.messages.push(newMessage);
    if (state.messages.length > 16) {
      state.messages.shift();
    }
    io.emit("msg:receive", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("< user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Running on post ${port}`);
});
