import { DataSource, Repository } from 'typeorm';
import { BaseRepository } from '../common/base/repository.base';
import { UserEntity } from './users.entity';
import { ValueOf } from '../common/utils';
import { AppDataSource } from '../db/data-source';
import { DBError } from '../common/errors/general.error';
import { CompaniesRepository } from '../companies/company.repository';
import { CompanyEntity } from '../companies/company.entity';

/**
 * A repository class for managing user entities in the database.
 */
export class UsersRepository {
  private companyRepositry: CompaniesRepository;
  private repository: Repository<UserEntity>;
  private connection: DataSource;
  constructor() {
    this.connection = AppDataSource;
    this.repository = this.connection.getRepository(UserEntity);
    this.companyRepositry = new CompaniesRepository();
  }

  /**
   * Retrieves a user from the database based on the specified field and value.
   * @param {keyof UserEntity} field - the field to search for the user by
   * @param {ValueOf<UserEntity>} value - the value to search for in the specified field
   * @returns {Promise<UserEntity>} - a promise that resolves to the user entity if found
   * @throws {DBError} - if there is an error retrieving the user from the database
   */

  public async getUserByCompanyfield(key: keyof CompanyEntity, value: ValueOf<CompanyEntity>) {
    try {
      const users = await this.repository
        .createQueryBuilder('users')
        .innerJoinAndSelect('users.companies', 'company')
        .where(`company.${key} = :${key}`, { [key]: value })
        .getOne();

      return users;
    } catch (error) {
      throw new DBError(error.message);
    }
  }

  public async getUserByField(field: keyof UserEntity, value: ValueOf<UserEntity>): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.repository.findOne({
        where: { [field]: value },
        relations: ['companies', 'companies.campaigns'],
      });
      console.log(user);
      return user;
    } catch (error) {
      throw new DBError(error.message);
    }
  }

  /**
   * Creates a new user in the database with the given user entity.
   * @param {UserEntity} user - The user entity to create.
   * @returns {Promise<UserEntity>} - The created user entity.
   * @throws {DBError} - If there is an error creating the user entity in the database.
   */
  public async createUser(user: UserEntity): Promise<UserEntity> {
    try {
      const entity: CompanyEntity = user.companies[0] as CompanyEntity;

      const compnayEntity: CompanyEntity = await this.companyRepositry.upsertCompany(entity);

      user.companies = [compnayEntity];

      const result = await this.repository.save({ ...user });

      return result;
    } catch (error) {
      throw new DBError(error.message);
    }
  }

  /**
   * Updates a user in the database and returns the updated user entity.
   * @param {UserEntity} user - The user entity to update.
   * @returns {Promise<UserEntity>} - The updated user entity.
   * @throws {DBError} - If there is an error updating the user entity in the database.
   */
  public async updateUser(user: UserEntity): Promise<UserEntity> {
    try {
      if (user.companies && user.companies.length > 0) {
        const companyEntity: CompanyEntity = user.companies[0];

        const compnayEntity: CompanyEntity = await this.companyRepositry.upsertCompany(companyEntity);

        user.companies = [compnayEntity];
      }

      const result = await this.repository.save(user);

      console.log(result);

      return user;
    } catch (error) {
      throw new DBError(error.message);
    }
  }
}
