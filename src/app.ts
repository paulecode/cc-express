import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/info", (req, res) => {
  res.send("API version 1");
});

app.get("/deploy", (req, res) => {
  res.send("Deployment test 1");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
