import { BaseRepository } from "../../common/base/repository.base";
import { DBError } from "../../common/errors/general.error";
import { AppDataSource } from "../../db/data-source";
import { TokensEntity } from "./tokens.entity";
import { LessThan, MoreThan } from "typeorm";

/**
 * A repository class for managing tokens in the database.
 */
export class TokensRepository extends BaseRepository<TokensEntity> {
  constructor() {
    super(TokensEntity, AppDataSource.manager);
  }

  /**
   * Generates a new token for the given entity and inserts it into the TokensEntity table.
   * If a token already exists for the given user, the existing token will be updated.
   * @param {TokensEntity} entity - The entity to insert or update in the TokensEntity table.
   * @returns {Promise<TokensEntity>} - The updated or newly created entity.
   * @throws {DBError} - If there is an error inserting or updating the entity in the database.
   */
  public async generatenNewToken(entity: TokensEntity): Promise<TokensEntity> {
    try {
      await this.createQueryBuilder()
        .insert()
        .into(TokensEntity)
        .values(entity)
        .orUpdate({
          conflict_target: ["userId"],
          overwrite: ["token", "expiredAt"],
        })
        .execute();

      return entity;
    } catch (err) {
      throw new DBError(err);
    }
  }

  /**
   * Retrieves the token expiration epoch time from the database for the given token.
   * @param {string} token - The token to retrieve the expiration epoch time for.
   * @returns {Promise<TokensEntity>} - A promise that resolves to the TokensEntity object with the expiration epoch time.
   * @throws {DBError} - If there is an error retrieving the token from the database.
   */
  public async getTokenExpireEpoch(token: string): Promise<TokensEntity> {
    try {
      const time = new Date().getTime();

      const entity = await this.findOne({
        relations: {
          user: true,
        },
        where: { token, expiredAt: MoreThan(time) },
      });

      return entity;
    } catch (err) {
      throw new DBError(err);
    }
  }
}
