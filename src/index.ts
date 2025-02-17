import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import AppDataSource from "./config/dataSource";
import routes from "./routes";

dotenv.config();

AppDataSource.initialize().then(() => {
  const app: Express = express();
  const port = process.env.SERVER_PORT;
  const client_url = process.env.CLIENT_URL || "http://localhost:5173";
  const client_url2 = process.env.CLIENT_URL_2 || "http://localhost:5173";


  app.use(
    cors({
      origin: [client_url, client_url2],
      credentials: true,
      exposedHeaders: ["Set-Cookie"]
    }));

  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(routes);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});
