import "dotenv/config";
import { Response, Request } from "express";
import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./middleware/loggerMiddleware";
import authRouter from "./routes/auth";
import { ErrorMiddleware } from "./middleware/errorMiddleware";
import fileRouter from "./routes/file";

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());
app.use(loggerMiddleware);

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

app.use("/auth", authRouter);
app.use("/files", fileRouter);

app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
