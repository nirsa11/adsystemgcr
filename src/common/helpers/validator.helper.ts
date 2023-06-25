import { validateOrReject, ValidationError } from "class-validator-multi-lang";
import { BadRequest } from "../errors/general.error";

/**
 * A class that provides validation methods for objects.
 */
export class Validator {
  static stringError: string = "";

  /**
   * Validates an object using class-validator and throws a BadRequest error if validation fails.
   * @param {Object} object - The object to validate.
   * @returns {Promise<void>} - A promise that resolves if validation succeeds and throws a BadRequest error if validation fails.
   * @throws {BadRequest} - Throws a BadRequest error if validation fails.
   */
  public static async validate(object: Object): Promise<void> {
    try {
      await validateOrReject(object, { validationError: { target: false } });
    } catch (errors) {
      if (!Array.isArray(errors)) throw new BadRequest("בקשה שגויה " + errors);

      let errorsMessage: string = this.getMessages(errors);

      this.stringError = "";

      throw new BadRequest("בקשה שגויה " + errorsMessage);
    }
  }

  /**
   * Validates a partial object using class-validator and throws a BadRequest error if validation fails.
   * @param {Object} object - The object to validate.
   * @returns {Promise<void>} - A promise that resolves if validation succeeds and rejects with a BadRequest error if validation fails.
   * @throws {BadRequest} - If validation fails, a BadRequest error is thrown with a message containing the validation errors.
   */
  public static async validatePartial(object: Object): Promise<void> {
    try {
      await validateOrReject(object, {
        skipUndefinedProperties: true,
        skipNullProperties: true,
        validationError: { target: false },
      });
    } catch (errors) {
      let errorsMessage: string = this.getMessages(errors);  
      this.stringError = "";

      throw new BadRequest("בקשה שגויה :  " + errorsMessage);
    }
  }

  /**
   * Takes in an array of validation errors and returns a string of error messages.
   * @param {ValidationError[]} errors - the array of validation errors
   * @param {string} [prop=""] - the property to which the errors belong
   * @returns A string of error messages
   */
  private static getMessages(
    errors: ValidationError[],
    prop: string = ""
  ): string {
    try {
      for (const error of errors) {
        if (error.constraints && Object.keys(error?.constraints).length) {
          this.stringError += `${prop} ${Object.values(error.constraints).join(
            ","
          )} .`;
        }

        if (error?.children?.length) {
          error.children[0].property = error.property;

          this.getMessages(error.children, error.property);
        }
      }
      return this.stringError;
    } catch (error) {
      console.log(error);
    }
  }
}
