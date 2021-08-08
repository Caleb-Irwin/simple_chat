import axios from "axios";

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

let messages = [];
function getMessages() {
  axios
    .get("/api/messages")
    .then((res) => {
      console.log(res.data);
      messages = res.data;
      displayMessages();
    })
    .catch((e) => {
      console.log(e);
      document.getElementById("messages").innerText = `Error! (${e})`;
    });
}

function displayMessages() {
  console.log("display messages");

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

getMessages();
setInterval(getMessages, 1500);

document.getElementById("send").addEventListener("click", () => {
  // @ts-expect-error
  let msg = document.getElementById("message").value;
  if (msg.length !== 0) {
    axios
      .post("/api/message", { uuid: uuid, message: msg })
      .then((res) => {
        console.log(res.data);
        messages = res.data;
        displayMessages();
        // @ts-expect-error
        document.getElementById("message").value = "";
      })
      .catch((e) => {
        console.log(e);
        document.getElementById("error").innerText = `Failed to Send! (${e})`;
      });
  }
});

document.getElementById("newUser").addEventListener("click", () => {
  newUser();
});
