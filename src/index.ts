import "reflect-metadata";
import * as functions from "firebase-functions";
import { RouterApi } from "./routes";
import { initDB } from "./db/connection.db";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { handleErrors } from "./common/middlewares/errorHandler.middleware";
import { createConnection, getConnectionOptions, Connection } from "typeorm";

/**
 * Initializes an Express app and sets up middleware for CORS, cookie parsing, and JSON parsing.
 * Also ensures a database connection before handling requests.
 * @param {Express} app - the Express app to use
 * @returns None
 */
const app: Express = express();

const corsOptions: cors.CorsOptions = {
  origin: "https://adsytemfrontts-w6s65zwlhq-zf.a.run.app",
  allowedHeaders: [
    "Authorization",
    "withCredentials",
    "Accept",
    "Content-Type",
  ],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const ensureDatabaseConnection = (app: Express) => {
  return async (req: Request, res: Response) => {
    try {
      const connection = await initDB();
      res.locals.connection = connection;
      app(req, res);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to establish database connection ." });
    }
  };
};

app.use("/v1", new RouterApi().initRouter(), handleErrors);

/**
 * Exports a Firebase Cloud Function that ensures a database connection before handling an HTTP request.
 * @param {object} app - The Firebase app instance.
 * @returns None
 */
exports.api = functions.https.onRequest(ensureDatabaseConnection(app));
