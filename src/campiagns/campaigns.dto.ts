import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator-multi-lang';
import { BaseDto } from '../common/abstract/dto.abstract';
import { UserEntity } from '../users/users.entity';
import { v4 as uuidv4 } from 'uuid';
import { IsBudgetGreaterThanLimit, UniqueOnDatabase } from '../common/utils/decorators.utils';
import { CampaignEntity } from './campaigns.entity';
import { CampaignStatusEnum } from '../common/enums/guestStatus.enum';
import { Type } from 'class-transformer';
import { UsersDto } from '../users/users.dto';
import { CompaniesDto } from '../companies/companies.dto';

/**
 * Data transfer object for Companies. This class is used to transfer data between the
 * client and server. It extends the BaseDto class and maps to the CompanyEntity class.
 */
export class CampaignDto extends BaseDto<CampaignDto, CampaignEntity> {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  endDate: number;

  @IsEnum(CampaignStatusEnum, { each: true })
  status: CampaignStatusEnum;

  @IsNumber()
  @IsNotEmpty()
  @IsBudgetGreaterThanLimit()
  budget: number;

  @IsNumber()
  @IsNotEmpty()
  dailyBudget: number;

  @IsNumber()
  @IsNotEmpty()
  createdAt: number;

  @IsNumber()
  @IsNotEmpty()
  createdBy: number;

  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  constructor(campagin: CampaignDto) {
    super();
    this.id = campagin.id;
    this.name = campagin.name;
    this.endDate = campagin.endDate;
    this.budget = campagin.budget;
    this.createdBy = campagin.createdBy;
    this.status = campagin.status;
    this.dailyBudget = campagin.dailyBudget;
    this.createdAt = campagin.createdAt || new Date().getTime();

    this.companyId = campagin.companyId;
  }
}
