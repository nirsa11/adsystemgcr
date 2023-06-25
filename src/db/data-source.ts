import "reflect-metadata";
import { DataSource } from "typeorm";
import { ENVHelper } from "../common/helpers/env.helper";

const getEntities = () => {
  if (process.env.NODE_ENV === "development") {
    return "src/**/*.entity.ts";
  } else {
    return "./**/*.entity.js";
  }
};
export const prod = process.env.NODE_ENV !== "development";

ENVHelper.init();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: ENVHelper.getVariable("DB_HOST"),
  port: parseInt(ENVHelper.getVariable("DB_PORT")),
  username: ENVHelper.getVariable("DB_USER"),
  password: ENVHelper.getVariable("DB_PASSWORD"),
  database: ENVHelper.getVariable("DB_DATABASE_NAME"),
  synchronize: true,
  logging: true,
  entities: [getEntities()],

  // // Production Mode
  // ...(prod && {
  //   database: ENVHelper.getVariable("DB_DATABASE_NAME"),
  //   logging: false,
  //   synchronize: false,
  //   extra: {
  //     socketPath: "/cloudsql/adsystem-388212:me-west1:adsystem-sql",
  //   },
  // }),
});
