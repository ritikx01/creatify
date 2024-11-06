import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";

import connectToDB from "./connection";
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined in the environment variables");
}
connectToDB(MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

import { bodyParsers } from "./middlewares/bodyParsers";
import { helmetMiddleware } from "./middlewares/helmet";
import { corsMiddleware } from "./middlewares/cors";

import apiRouter from "./routes/api";

import cookieParser from "cookie-parser";

const app = express();
const PORT: number = 3000;
const HOSTNAME: string = "127.0.0.1";

app.use(cookieParser());

app.use(bodyParsers);
app.use(corsMiddleware);
app.use(helmetMiddleware);

app.use("/api", apiRouter);

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on port ${PORT}`);
});
