import { BaseAbstractRoute } from "../common/abstract/route.absrtact";
import express, { NextFunction, Router, Request } from "express";
import { RequestUser } from "../common/interfaces/requestUser.interface";
import { UsersController } from "./users.controller";

/**
 * A class representing the UsersRouter, which extends the BaseAbstractRoute class.
 * This class is responsible for handling all user-related routes.
 */
export class UsersRouter extends BaseAbstractRoute {
  public controller: UsersController;
  constructor() {
    super();
    this.controller = new UsersController();
  }

  public initRouter() {
    this.router.post(
      "/login",
      (req: RequestUser, res: express.Response, next: NextFunction) => {
        this.controller.login(req, res, next);
      }
    );

    this.router.post(
      "/register",
      (req: RequestUser, res: express.Response, next: NextFunction) => {
        this.controller.register(req, res, next);
      }
    );

    this.router.post(
      "/forgotpassword",
      (req: RequestUser, res: express.Response, next: NextFunction) => {
        this.controller.forgotPassword(req, res, next);
      }
    );

    this.router.get(
      "/forgotpasswordtoken",
      (req: RequestUser, res: express.Response, next: NextFunction) => {
        this.controller.checkForgotPasswordExpires(req, res, next);
      }
    );

    this.router.put(
      "/",
      (req: RequestUser, res: express.Response, next: NextFunction) => {
        this.controller.updateUser(req, res, next);
      }
    );

    this.router.patch(
      "/",
      (req: RequestUser, res: express.Response, next: NextFunction) => {
        this.controller.updateUser(req, res, next);
      }
    );

    return this.router;
  }
}
