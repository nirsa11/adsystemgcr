import path from "path";

/**
 * A helper class for managing environment variables.
 */
export class ENVHelper {
  static path: string = `./../../../.env.${this.getMode()}`;

  static init() {
    this.path = `./../../../.env.${this.getMode()}`;
  }

  static getMode() {
    return process.env.NODE_ENV || "production";
  }

  static getVariable(key: string): any {
    const value = process.env[key];

    return value;
  }
}

require("dotenv").config({
  path: path.resolve(__dirname, ENVHelper.path),
});
