import { BaseAbstractRoute } from '../common/abstract/route.absrtact';
import express, { NextFunction, Router, Request } from 'express';
import { RequestUser } from '../common/interfaces/requestUser.interface';
import { CampaignsController } from './campaigns.controller';

/**
 * A router class for handling campaigns routes.
 * @extends BaseAbstractRoute
 */
export class CampaignsRouter extends BaseAbstractRoute {
  public controller: CampaignsController;

  constructor() {
    super();
    this.controller = new CampaignsController();
  }

  public initRouter() {
    this.router.post('', (req: RequestUser, res: express.Response, next: NextFunction) => {
      this.controller.create(req, res, next);
    });

    return this.router;
  }
}
