import axios from "axios";
axios.get("/api/ping").then((res) => {
  console.log(res.data);
});
