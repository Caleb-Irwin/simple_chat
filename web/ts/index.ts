import axios from "axios";

import mmm from "./message";

let messages = [];

let msgManager = new mmm((data) => {
  console.log(data);
  messages = data;
  displayMessages();
});

let uuid = undefined;
let color = undefined;

function newUser() {
  axios
    .get("/api/newUser")
    .then((res) => {
      console.log(res.data);
      uuid = res.data.uuid;
      color = res.data.color;
      document.getElementById("body").style.backgroundColor = "#" + color;
      document.getElementById(
        "user"
      ).innerText = `UUID: "${uuid}" Color: "#${color}"`;
    })
    .catch((err) => {
      console.log(err);
      document.getElementById("user").innerText = "Error: " + err;
    });
}
newUser();

function displayMessages() {
  // console.log("display messages");

  let messagesElement = document.getElementById("messages");
  messagesElement.innerHTML = "";
  messages.forEach((m) => {
    var newLi = document.createElement("LI");
    newLi.style.backgroundColor = "#" + m.color;
    var text = document.createTextNode(m.message);
    newLi.appendChild(text);
    messagesElement.appendChild(newLi);
  });
}

document.getElementById("send").addEventListener("click", () => {
  // @ts-expect-error
  let msg = document.getElementById("message").value;
  if (msg.length !== 0) {
    msgManager.sendMessage(msg, uuid);
  }
});

document.getElementById("newUser").addEventListener("click", () => {
  newUser();
});
