import { DataSource, Repository, UpdateResult } from "typeorm";
import { BaseRepository } from "../common/base/repository.base";
import { DBError } from "../common/errors/general.error";
import { AppDataSource } from "../db/data-source";
import { CompanyEntity } from "./company.entity";

/**
 * A repository class for managing CompanyEntity objects in the database.
 */
export class CompaniesRepository {
  private repository: Repository<CompanyEntity>;
  private connection: DataSource;
  constructor() {
    this.connection = AppDataSource;
    this.repository = this.connection.getRepository(CompanyEntity);
  }

  /**
   * Upserts a company entity into the database.
   * @param {CompanyEntity} companyEntity - The company entity to upsert.
   * @returns {Promise<CompanyEntity>} - The upserted company entity.
   * @throws {DBError} - If there is an error upserting the company entity.
   */
  public async upsertCompany(
    companyEntity: CompanyEntity
  ): Promise<CompanyEntity> {
    try {
      const company: CompanyEntity = await this.repository.save(companyEntity);

      return company;
    } catch (error) {
      throw new DBError(error.message);
    }
  }
}
