import mmm from "./message";

let messages = [];

let msgManager = new mmm(
  (data) => {
    console.log(data);
    messages = data;
    displayMessages();
  },
  (uuid, color) => {
    document.getElementById("body").style.backgroundColor = "#" + color;
    document.getElementById(
      "user"
    ).innerText = `UUID: "${uuid}" Color: "#${color}"`;
  }
);

function displayMessages() {
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
    msgManager.sendMessage(msg);
  }
});

document.getElementById("newUser").addEventListener("click", () => {
  msgManager.newAccount();
});
