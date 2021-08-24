import { createServer } from "http";
import express from "express";
import { v4 } from "uuid";
import { Server } from "socket.io";
import compression from "compression";

const app = express();
const server = createServer(app);

const port = 8080;

type color = string;

interface message {
  color: string;
  message: string;
}

interface stateInterface {
  users: { [uuid: string]: string };
  messages: message[];
}

let state: stateInterface = {
  users: {},
  messages: [],
};

app.use(compression());
app.use(express.static("../web/dist/"));
app.use(express.json());

app.get("/api/newUser", (req, res) => {
  let uuid = v4();
  let color = "";
  while (color.length !== 6) {
    color = Math.floor(Math.random() * 16777215).toString(16);
  }
  state.users[uuid] = color;
  console.log(`**NEW** User (${uuid}, #${color})`);
  res.send(JSON.stringify({ uuid, color }));
});

app.get("/api/messages", (req, res) => {
  res.send(JSON.stringify(state.messages));
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`a user connected (${socket.id})`);
  io.emit("msg", state.messages);

  socket.on("msg", (msg) => {
    console.log(msg);
    if (!state.users[msg.uuid]) {
      // res.sendStatus(401);
      console.log("Unauthorized (401)");
      return;
    }
    if (!msg.msg || msg.msg.length === 0) {
      // res.sendStatus(400);
      console.log("Bad Request (400)");
      return;
    }
    state.messages.push({
      color: state.users[msg.uuid],
      message: msg.msg,
    });
    if (state.messages.length > 16) {
      state.messages.shift();
    }
    io.emit("msg", state.messages);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Running on post ${port}`);
});
