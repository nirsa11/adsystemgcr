import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { UnAuthorized } from "../errors/general.error";

export class UserJWTPayload {
  id: number;
  email: string;
  role: number;
}

/**
 * A helper class for creating and verifying JSON Web Tokens (JWTs).
 */
export class JWTHelper {
  private jwt;
  private secret: Secret;
  constructor() {
    this.jwt = jwt;
    this.secret = "some-eceret-key";
  }

  /**
   * Signs a JWT token with the given payload and returns the token string.
   * @param {UserJWTPayload} payload - The payload to include in the JWT token.
   * @returns {string} - The signed JWT token string.
   */
  public sign(payload: UserJWTPayload): string {
    return this.jwt.sign(
      { id: payload.id, email: payload.email, role: payload.role },
      this.secret,
      {
        expiresIn: "7d",
      }
    );
  }

  /**
   * Verifies the given JWT token using the secret key and returns the decoded payload.
   * @param {string} token - The JWT token to verify.
   * @returns {JwtPayload} - The decoded payload of the JWT token.
   * @throws {UnAuthorized} - If the token is invalid or cannot be verified.
   */
  public verify(token: string): JwtPayload {
    try {
      const decoded: JwtPayload = this.jwt.verify(token, this.secret);

      return decoded;
    } catch (error) {
      throw new UnAuthorized("Invalid token");
    }
  }
}
