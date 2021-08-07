import axios from "axios";

let uuid = undefined;
let color = undefined;

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
