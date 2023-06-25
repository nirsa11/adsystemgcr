import { LoginDto, TokensdDto, UsersDto } from './users.dto';
import bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { UserEntity } from './users.entity';
import { JWTHelper } from '../common/helpers/jwt.helper';
import { BadRequest, Forbidden, GeneralError, NotFound } from '../common/errors/general.error';
import { v4 as uuidv4 } from 'uuid';
import { EmailHelper } from '../common/helpers/email.helper';
import { TokensRepository } from './forgotPassword/token.repository';
import { TokensEntity } from './forgotPassword/tokens.entity';
import { ValueOf } from '../common/utils';
import { CompanyEntity } from '../companies/company.entity';

/**
 * A service class that handles user authentication and registration.
 */
export class UsersService {
  private usersRepository: UsersRepository;

  private JWTHelper: JWTHelper;
  constructor() {
    this.usersRepository = new UsersRepository();
    this.JWTHelper = new JWTHelper();
  }

  /**
   * Authenticates a user by checking if the email and password match a user in the database.
   * @param {LoginDto} LoginDto - An object containing the email and password of the user.
   * @returns {Promise<UsersDto>} - A promise that resolves to a UsersDto object containing the user's information and an access token.
   * @throws {NotFound} - If the user is not found in the database.
   * @throws {BadRequest} - If the email or password is incorrect.
   * @throws {GeneralError} - If there is an error while processing the request.
   */

  public async getUserByfield(field: keyof UserEntity, value: ValueOf<UserEntity>): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.usersRepository.getUserByField(field, value);
      return user;
    } catch (error) {
      throw new GeneralError(error.message, error?.getCode() || 500);
    }
  }

  public async getUserByCompanyfield(field: keyof CompanyEntity, value: ValueOf<CompanyEntity>): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.usersRepository.getUserByCompanyfield(field, value);
      return user;
    } catch (error) {
      throw new GeneralError(error.message, error?.getCode() || 500);
    }
  }

  public async getBusinessId(userId: number) {
    try {
      const user: UserEntity = await this.usersRepository.getUserByField('id', userId);

      return user?.companies[0] && user?.companies[0].businessId;
    } catch (error) {
      throw new GeneralError(error.message, error?.getCode() || 500);
    }
  }

  public async login({ email, password }: LoginDto): Promise<UsersDto> {
    try {
      const userEntity: UserEntity = await this.usersRepository.getUserByField('email', email);

      if (!userEntity) {
        throw new NotFound('User not found');
      }

      const isMatch = bcrypt.compareSync(password, userEntity.password);

      if (!isMatch) {
        throw new BadRequest('Email or password is incorrect');
      }

      const accessToken: string = this.JWTHelper.sign({
        id: userEntity.id,
        email: userEntity.email,
        role: 1,
      });

      return new UsersDto({
        ...userEntity,
        accessToken,
      } as unknown as UsersDto);
    } catch (error) {
      console.log(error);
      throw new GeneralError(error.message, error?.getCode() || 500);
    }
  }

  /**
   * Registers a new user by creating a new user entity and storing it in the database.
   * @param {UsersDto} userDto - The user data transfer object containing the user's information.
   * @returns {Promise<UsersDto>} - A promise that resolves to a UsersDto object containing the newly created user's information and access token.
   * @throws {BadRequest} - If the user entity is not created.
   * @throws {GeneralError} - If there is an error creating the user entity.
   */
  public async register(userDto: UsersDto): Promise<UsersDto> {
    try {
      const entity: UserEntity = userDto.fromEntity();

      const saltRounds = 8;

      entity.password = await bcrypt.hash(entity.password, saltRounds);

      const userEntity: UserEntity = await this.usersRepository.createUser(entity);

      if (userEntity) {
        const accessToken: string = this.JWTHelper.sign({
          id: userEntity.id,
          email: userEntity.email,
          role: 1,
        });

        return new UsersDto({ ...userEntity, accessToken } as unknown as UsersDto);
      } else {
        throw new BadRequest('User not created');
      }
    } catch (error) {
      throw new GeneralError(error.message, error?.getCode() || 500);
    }
  }

  /**
   * Updates a user in the database with the given user data.
   * @param {Partial<UsersDto>} userDto - The user data to update.
   * @returns {Promise<UsersDto>} - The updated user data.
   * @throws {GeneralError} - If there is an error updating the user.
   */
  public async updateUser(userDto: Partial<UsersDto>): Promise<UsersDto> {
    try {
      const entity: UserEntity = userDto.toEntity();

      if (userDto.password) {
        const saltRounds = 8;

        entity.password = await bcrypt.hash(entity.password, saltRounds);
      } else {
        delete userDto.password;
      }

      const userEntity: UserEntity = await this.usersRepository.updateUser(entity);

      return new UsersDto({ ...userEntity } as unknown as UsersDto);
    } catch (error) {
      console.log(error);
      throw new GeneralError(error.message, error?.getCode() || 500);
    }
  }

  /**
   * Sends a forgot password email to the user with the given email address.
   * @param {string} email - The email address of the user.
   * @returns {Promise<TokensdDto>} - A promise that resolves to a TokensdDto object.
   * @throws {NotFound} - If no user is found with the given email address.
   * @throws {GeneralError} - If there is an error while sending the email.
   */
  public async forgotPassword(email: string): Promise<TokensdDto> {
    try {
      const user: UserEntity = await this.usersRepository.getUserByField('email', email);

      if (!user) {
        throw new NotFound('User not found');
      }

      const entity = new TokensEntity();

      entity.token = uuidv4();

      entity.expiredAt = new Date().getTime() + 300000;

      entity.user = user;

      const tokenEntity: TokensEntity = await new TokensRepository().generatenNewToken(entity);

      const emailService = new EmailHelper();

      await emailService.sendForgotPasswordEmail(user.email, `https://adsytemfrontts-w6s65zwlhq-zf.a.run.app/auth?token=${tokenEntity.token}`, user.name);

      return new TokensdDto(tokenEntity as unknown as TokensdDto);
    } catch (error) {
      throw new GeneralError(error.message, 500);
    }
  }

  /**
   * Checks if the given token has expired and returns a new access token if it has not.
   * @param {string} token - The token to check for expiration.
   * @returns {Promise<string>} - A new access token if the given token has not expired.
   * @throws {Forbidden} - If the given token has expired.
   * @throws {GeneralError} - If there is an error while checking the token's expiration.
   */
  public async checkTokenExpires(token: string): Promise<string> {
    try {
      const tokenEntity: TokensEntity = await new TokensRepository().getTokenExpireEpoch(token);

      if (!tokenEntity) {
        throw new Forbidden('Token has expired');
      }

      const accessToken: string = this.JWTHelper.sign({
        id: tokenEntity.user.id,
        email: tokenEntity.user.email,
        role: tokenEntity.user.role,
      });

      return accessToken;
    } catch (error) {
      if (error instanceof GeneralError) throw new GeneralError(error.message, error.getCode());

      throw new GeneralError(error.message, 500);
    }
  }
}
