import { GeneralError } from "../common/errors/general.error";
import { CompaniesDto } from "./companies.dto";
import { CompanyEntity } from "./company.entity";
import { CompaniesRepository } from "./company.repository";

/**
 * A service class for managing companies.
 */
export class CompaniesService {
  private companiesRepository: CompaniesRepository;

  constructor() {
    this.companiesRepository = new CompaniesRepository();
  }

  public async create(companyDto: CompaniesDto): Promise<CompaniesDto> {
    try {
      const entity: CompanyEntity = companyDto.toEntity();

      const companyEntity: CompanyEntity =
        await this.companiesRepository.upsertCompany(entity);
      return new CompaniesDto({ ...companyEntity } as CompaniesDto);
    } catch (error) {
      throw new GeneralError(error.message, error?.getCode() || 500);
    }
  }
}
