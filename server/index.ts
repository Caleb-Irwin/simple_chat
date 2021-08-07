import express from "express";
import { v4 } from "uuid";

const app = express();
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

app.use(express.static("../web/dist/"));
app.use(express.json());

app.get("/api/ping", (req, res) => {
  res.send("Pong!");
});

app.get("/api/newUser", (req, res) => {
  let uuid = v4();
  let color = Math.floor(Math.random() * 16777215).toString(16);
  state.users[uuid] = color;
  res.send(JSON.stringify({ uuid, color }));
});

app.get("/api/messages", (req, res) => {
  res.send(JSON.stringify(state.messages));
});

app.post("/api/message", (req, res) => {
  if (!state.users[req.body?.uuid]) {
    res.sendStatus(401);
    return;
  }
  if (!req.body.message || req.body.message?.length === 0) {
    res.sendStatus(400);
    return;
  }
  state.messages.push({
    color: state.users[req.body.uuid],
    message: req.body.message,
  });
  if (state.messages.length > 16) {
    state.messages.shift();
  }
  res.send(JSON.stringify(state.messages));
});

app.listen(port, () => {
  console.log(`Running on post ${port}`);
});
