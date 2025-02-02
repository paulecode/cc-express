import { Response, Request } from "express";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/info", (req, res) => {
  res.send("API version 1");
});

app.get("/deploy", (req: Request, res: Response) => {
  res.send("Deployment test 3");
});

app.get("/fastapi", async (req: Request, res: Response) => {
  try {
    const FASTAPI_URL = process.env.FASTAPI_URL || "";
    const response = await fetch(FASTAPI_URL + "/express");
    const data = await response.json();
    res.json({ result: data });
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
