import express from "express";

const app = express();
const port = 8080;

app.use(express.static("../web/dist/"));

app.get("/api/ping", (req, res) => {
  res.send("Pong!");
});

app.listen(port, () => {
  console.log(`Running on post ${port}`);
});
