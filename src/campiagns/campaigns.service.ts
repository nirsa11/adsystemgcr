import { classToPlain } from 'class-transformer';
import { CampaignDto } from './campaigns.dto';
import { CampaignEntity } from './campaigns.entity';
import { CampaginsRepository } from './campaigns.repository';
import { CompanyEntity } from '../companies/company.entity';

export class CampaginsService {
  private campaginsRepository: CampaginsRepository;
  constructor() {
    this.campaginsRepository = new CampaginsRepository();
  }

  /**
   * Creates a new campaign using the provided campaign DTO.
   * @param {CampaignDto} campaignDto - The campaign DTO object.
   * @returns {Promise<CampaignDto>} - A promise that resolves to the newly created campaign DTO.
   * @throws {Error} - If there is an error creating the campaign.
   */
  public async createCampaign(campaignDto: CampaignDto): Promise<CampaignDto> {
    try {
      const campaignEntity: CampaignEntity = campaignDto.toEntity();

      const company: CompanyEntity = new CompanyEntity();

      company.id = campaignDto.companyId;

      campaignEntity.company = company;

      const entityCreated: CampaignEntity = await this.campaginsRepository.createCampaign(campaignEntity);

      const campiagnObj = classToPlain(entityCreated);

      return new CampaignDto({ ...campiagnObj } as CampaignDto);
    } catch (error) {}
  }
}
