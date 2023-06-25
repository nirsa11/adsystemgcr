import { BaseAbstractRoute } from '../common/abstract/route.absrtact';
import { RequestUser } from '../common/interfaces/requestUser.interface';
import { Router, NextFunction } from 'express';
import { UsersRouter } from '../users/users.route';
import { AuthMiddleware } from '../common/middlewares/auth.middleware';
import express from 'express';
import { CompaniesRouter } from '../companies/companies.route';
import { AppDataSource } from '../db/data-source';
import { CampaignsRouter } from '../campiagns/campaigns.route';

/**
 * RouterApi is a class that extends BaseAbstractRoute and is responsible for initializing the router
 * and applying middleware to it. It also initializes the routes for the users and companies routers.
 * @constructor
 */
export class RouterApi extends BaseAbstractRoute {
  controller: any;

  constructor() {
    super();
  }

  public initRouter(): Router {
    console.log('init router');

    this.applyMiddleware([(req: RequestUser, res: express.Response, next: NextFunction) => new AuthMiddleware().init(req, res, next)]);

    this.init('users', new UsersRouter());
    this.init('company', new CompaniesRouter());
    this.init('campaigns', new CampaignsRouter());

    //return response  404
    this.router.all('*', function (req, res) {
      return res.status(404).json({
        status: 'error',
        message: 'Not Found',
      });
    });

    return this.router;
  }
}
