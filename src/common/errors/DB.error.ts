/**
 * Represents an error that occurred while interacting with the database.
 * @class
 * @extends Error
 * @property {any} error - The error object that was thrown.
 * @param {any} error - The error object that was thrown.
 * @param {string} [message] - The error message to display.
 */
export class DBError extends Error {
  public error: any;
  constructor(error: any, message?) {
    super(message);
    this.error = error;
  }
}
