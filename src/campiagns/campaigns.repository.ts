import { DataSource, Repository } from 'typeorm';
import { CampaignEntity } from './campaigns.entity';
import { AppDataSource } from '../db/data-source';
import { DBError } from '../common/errors/general.error';

export class CampaginsRepository {
  private repository: Repository<CampaignEntity>;
  private connection: DataSource;
  constructor() {
    this.connection = AppDataSource;
    this.repository = this.connection.getRepository(CampaignEntity);
  }

  public async createCampaign(entity: CampaignEntity): Promise<CampaignEntity> {
    try {
      const result: CampaignEntity = await this.repository.save(entity);

      return result;
    } catch (error) {
      throw new DBError(error.message);
    }
  }
}
