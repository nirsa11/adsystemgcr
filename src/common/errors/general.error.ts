/**
 * A set of custom error classes that extend the built-in Error class. Each error class
 * represents a specific HTTP error code and can be used to throw custom errors with
 * specific messages and codes.
 * @class
 * @extends Error
 * @property {number} code - The HTTP error code associated with the error.
 * @constructor
 * @param {string} message - The error message.
 * @param {number} [code] - The HTTP error code associated with the error.
 * @returns An instance of the error class.
 */
export class GeneralError extends Error {
  code: number;
  constructor(message, code?: number) {
    super();
    this.message = message;
    this.code = code;
  }

  getCode(): number {
    switch (true) {
      case this instanceof BadRequest:
        return 400;
      case this instanceof NotFound:
        return 404;
      case this instanceof UnAuthorized:
        return 401;
      case this instanceof Forbidden:
        return 403;
      case this instanceof DBError:
        return 500;
      case this instanceof ConflictError:
        return 409;
      default:
        return this.code || 500;
    }
  }
}

export class BadRequest extends GeneralError {}
export class NotFound extends GeneralError {}
export class UnAuthorized extends GeneralError {}
export class DBError extends GeneralError {}
export class Forbidden extends GeneralError {}
export class ConflictError extends GeneralError {}
