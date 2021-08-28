import msgManager from "./message";

let mm = new msgManager({
  onMessage: (newMsg) => {
    console.log("newMsg", newMsg);
    displayMessages();
  },
  onAuth: (uuid, color) => {
    document.getElementById("body").style.backgroundColor = "#" + color;
    document.getElementById(
      "user"
    ).innerText = `UUID: "${uuid}" Color: "#${color}"`;
  },
});

function displayMessages() {
  let messagesElement = document.getElementById("messages");
  messagesElement.innerHTML = "";
  mm.messages.forEach((m) => {
    var newLi = document.createElement("LI");
    newLi.style.backgroundColor = "#" + m.color;
    var text = document.createTextNode(`${m.senderType}: ${m.message}`);
    newLi.appendChild(text);
    messagesElement.appendChild(newLi);
  });
}

document.getElementById("send").addEventListener("click", () => {
  // @ts-expect-error
  let msg = document.getElementById("message").value;
  if (msg.length !== 0) {
    mm.sendMessage(msg);
  }
});

document.getElementById("newUser").addEventListener("click", () => {
  mm.newAccount();
});
