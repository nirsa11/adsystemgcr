import express, { Express, NextFunction, Request } from "express";
import cors from "cors";
import "./common/helpers/env.helper";

import { RouterApi } from "./routes";
import { handleErrors } from "./common/middlewares/errorHandler.middleware";
import cookieParser from "cookie-parser";
import { initDB } from "./db/connection.db";
import { DataSource } from "typeorm";

/**
 * A class representing a server that handles API requests.
 */
export class Server {
  private app: Express;
  constructor() {
    this.app = express();
    this.app.use(cors());

    this.app.use(cookieParser());
    this.app.use(express.json());

    this.app.use(
      this.getApiPrefix(),
      new RouterApi().initRouter(),
      handleErrors
    );
  }

  async initConnection(): Promise<void> {
    await initDB();
  }

  private getApiPrefix(): string {
    const apiPrefix =
      process.env.NODE_ENV === "development" ? "/api/v1" : "/v1";

    return apiPrefix;
  }

  public export() {
    return this.app;
  }

  public async start(port: number) {
    if (process.env.NODE_ENV === "development") {
      return await new Promise((resolve, reject) => {
        this.app.listen(port, () => {
          resolve(port);
        });
      });
    }
  }
}
