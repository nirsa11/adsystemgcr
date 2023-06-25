import express, { NextFunction } from 'express';
import { RequestUser } from '../common/interfaces/requestUser.interface';
import { CampaginsService } from './campaigns.service';
import { CampaignDto } from './campaigns.dto';

/**
 * The CampaignsController class handles HTTP requests related to campaigns.
 * @class
 */
export class CampaignsController {
  private service: CampaginsService;
  constructor() {
    this.service = new CampaginsService();
  }

  public async create(req: RequestUser, res: express.Response, next: NextFunction) {
    try {
      const campaginDto: CampaignDto = new CampaignDto(req.body);

      await campaginDto.validate(campaginDto);

      const campaignCreated: CampaignDto = await this.service.createCampaign(campaginDto);

      res.send(campaignCreated);
    } catch (error) {
      next(error);
    }
  }
}
