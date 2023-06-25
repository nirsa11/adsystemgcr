import { BadRequest, UnAuthorized } from "../errors/general.error";
import { JWTHelper } from "../helpers/jwt.helper";
import { RequestUser } from "../interfaces/requestUser.interface";
import express, { NextFunction, Request } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { isNullOrUndefined } from "../utils";

export class AuthMiddleware {
  private user;
  private jwtService: JWTHelper;

  constructor() {
    this.jwtService = new JWTHelper();
  }

  init(req: RequestUser, res: express.Response, next: NextFunction) {
    try {
      if (this.isLoginOrRegisterRoute(req)) {
        return next();
      }

      const token: string =
        req?.headers?.authorization?.split(" ")[1] || ("" as string);

      if (isNullOrUndefined(token)) {
        throw new UnAuthorized("unauthorized , user credential not valid");
      }

      this.user = this.jwtService.verify(token);

      if (isNullOrUndefined(this.user)) {
        throw new UnAuthorized("unauthorized , user credential not valid");
      }

      if (this.user) {
        req.user = this.user;
        return next();
      }
    } catch (error) {
      if (error instanceof BadRequest) {
        return res
          .status(error.getCode())
          .send({ errorMessage: error.message });
      }
      res.status(401).send({
        status: "error",
        message: error.message,
      });
    }
  }

  private isLoginOrRegisterRoute(request: Request): boolean {
    return (
      (request.method === "POST" && request.url.includes("users")) ||
      (request.method === "GET" && request.url.includes("users"))
    );
  }
}
