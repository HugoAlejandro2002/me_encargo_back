import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import AppDataSource from "./config/dataSource";
import routes from "./routes";

dotenv.config();

AppDataSource.initialize().then(() => {
  const app: Express = express();
  const port = process.env.SERVER_PORT;

  app.use(express.json())
  app.use(cors())
  app.use(routes);

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  }); 
})
