import { DataSource } from "typeorm";
import { AppDataSource } from "./data-source";

export const initDB = async (): Promise<DataSource> => {
  try {
    const connection: DataSource = await AppDataSource.initialize();

    return connection;
  } catch (error) {
    console.log(error);
  }
};
