import "reflect-metadata";
import { Server } from "./server";

/**
 * Starts the server on the specified port or 4000 if no port is specified.
 * @returns {Promise<void>} None
 */
const startServer = async (): Promise<void> => {
  const port = 8080;

  try {
    const appInstance: Server = new Server();

    await appInstance.initConnection();

    await appInstance.start(port);
    console.log(`server running on port ${port}`);
  } catch (err) {
    console.error(err);
  }
};

startServer();
