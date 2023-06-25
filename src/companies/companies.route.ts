import { BaseAbstractRoute } from '../common/abstract/route.absrtact';
import express, { NextFunction, Router, Request } from 'express';
import { RequestUser } from '../common/interfaces/requestUser.interface';
import { CompaniesController } from './companies.controller';

/**
 * A router class for handling requests related to companies.
 * @extends BaseAbstractRoute
 * @property {CompaniesController} controller - The controller for handling company requests.
 */
export class CompaniesRouter extends BaseAbstractRoute {
  public controller: CompaniesController;

  constructor() {
    super();
    this.controller = new CompaniesController();
  }

  public initRouter() {
    this.router.post('', (req: RequestUser, res: express.Response, next: NextFunction) => {
      this.controller.create(req, res, next);
    });

    return this.router;
  }
}
