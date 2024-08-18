import "dotenv/config";
import { Response, Request } from "express";
import express from "express";
import cors from "cors";
import { loggerMiddleware } from "./middleware/loggerMiddleware";
import { ErrorMiddleware } from "./middleware/errorMiddleware";
import authRouter from "./routes/authRouter";
import fileRouter from "./routes/fileRouter";
import predictRouter from "./routes/predictRouter";

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());
app.use(loggerMiddleware);

app.get("/deploy", (_req: Request, res: Response) => {
  res.send("Deployment test 3");
});

app.get("/fastapi", async (_req: Request, res: Response) => {
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
app.use("/predict", predictRouter);

app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
