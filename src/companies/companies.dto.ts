import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator-multi-lang';
import { BaseDto } from '../common/abstract/dto.abstract';
import { CompanyEntity } from './company.entity';
import { UserEntity } from '../users/users.entity';
import { v4 as uuidv4 } from 'uuid';
import { UniqueOnDatabase } from '../common/utils/decorators.utils';
import { CampaignDto } from '../campiagns/campaigns.dto';
import { UsersDto } from '../users/users.dto';

/**
 * Data transfer object for Companies. This class is used to transfer data between the
 * client and server. It extends the BaseDto class and maps to the CompanyEntity class.
 */
export class CompaniesDto extends BaseDto<CompaniesDto, CompanyEntity> {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nameForTaxInvoice: string;

  @IsNumberString()
  @IsNotEmpty()
  @UniqueOnDatabase(CompanyEntity)
  businessId: string;

  @IsString()
  address: string;

  createdAt: Date;

  campaigns: CampaignDto[];

  constructor(company: CompaniesDto) {
    super();
    this.id = company.id;
    this.name = company.name;
    this.nameForTaxInvoice = company.nameForTaxInvoice;
    this.businessId = company.businessId;
    this.address = company.address;
    this.createdAt = company.createdAt;

    this.campaigns = company.campaigns;
  }
}
