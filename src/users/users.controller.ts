import { RequestUser } from '../common/interfaces/requestUser.interface';
import express, { Request, NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';
import { JWTHelper } from '../common/helpers/jwt.helper';
import { ForgotPasswordDto, LoginDto, TokensdDto, UsersDto } from './users.dto';
import { UsersService } from './users.service';
import { TokensRepository } from './forgotPassword/token.repository';
import { instanceToPlain } from 'class-transformer';
import { BaseController } from '../common/base/controller.base';
import { UserEntity } from './users.entity';
import { BadRequest } from '../common/errors/general.error';

/**
 * A controller class that handles user-related requests.
 */
export class UsersController {
  private usersService: UsersService;
  constructor() {
    this.usersService = new UsersService();
  }

  /**
   * Logs in a user by validating the login credentials and returning an access token.
   * @param {RequestUser} req - The request object containing the user's login credentials.
   * @param {express.Response} res - The response object to send the user's data and access token.
   * @param {NextFunction} next - The next function to call if there is an error.
   * @returns {Promise<Response>} - A response object containing the user's data and access token.
   * @throws {Error} - If there is an error logging in the user.
   */
  public async login(req: RequestUser, res: express.Response, next: NextFunction): Promise<Response> {
    try {
      const loginDto: LoginDto = new LoginDto(req.body);

      const user: UsersDto = await this.usersService.login(loginDto);

      const userResponse = instanceToPlain(user);

      return res
        .cookie('accessToken', user.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .send(userResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Registers a new user by validating the request body, creating a new user with the provided data,
   * and returning the user object with an access token cookie.
   * @param {RequestUser} req - The request object containing the user data.
   * @param {express.Response} res - The response object to send the user data and access token cookie.
   * @param {NextFunction} next - The next function to call if there is an error.
   * @returns {Promise<Response>} - A promise that resolves with the user data and access token cookie.
   * @throws {Error} - If there is an error during the registration process.
   */
  public async register(req: RequestUser, res: express.Response, next: NextFunction): Promise<Response> {
    try {
      const userDto: UsersDto = new UsersDto(req.body);

      await userDto.validate(userDto);

      const userCreated: UsersDto = await this.usersService.register(userDto);

      const userResponse = instanceToPlain(userCreated);

      return res
        .cookie('accessToken', userCreated.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .send(userResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the forgot password functionality for a user. Validates the request body,
   * generates a password reset token, and sends it to the user's email.
   * @param {RequestUser} req - The request object containing the user's email.
   * @param {express.Response} res - The response object to send the token to.
   * @param {NextFunction} next - The next function to call if there is an error.
   * @returns {Promise<Response>} - A promise that resolves with the response object.
   */
  public async forgotPassword(req: RequestUser, res: express.Response, next: NextFunction): Promise<Response> {
    try {
      const dto: ForgotPasswordDto = new ForgotPasswordDto(req.body);

      await dto.validate(dto);

      const token: TokensdDto = await this.usersService.forgotPassword(dto.email);

      return res.send(token);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Checks if the forgot password token has expired and returns a new access token if it has not.
   * @param {RequestUser} req - The request object containing the forgot password token.
   * @param {express.Response} res - The response object to send the new access token in a cookie.
   * @param {NextFunction} next - The next function to call if there is an error.
   * @returns {Promise<Response>} - A promise that resolves with the new access token in a cookie.
   * @throws {Error} - Throws an error if the forgot password token is invalid or has expired.
   */
  public async checkForgotPasswordExpires(req: RequestUser, res: express.Response, next: NextFunction): Promise<Response> {
    try {
      const dto: TokensdDto = new TokensdDto({
        token: req.query.token as string,
      } as TokensdDto);

      await dto.validate(dto);

      const accessToken: string = await this.usersService.checkTokenExpires(dto.token);

      return res
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .send({ accessToken });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a user's information with the given request body.
   * @param {RequestUser} req - The request object containing the user's information to update.
   * @param {express.Response} res - The response object to send the updated user information to.
   * @param {NextFunction} next - The next function to call if there is an error.
   * @returns None
   */
  public async updateUser(req: RequestUser, res: express.Response, next: NextFunction) {
    try {
      const userDtoUpdate: Partial<UsersDto> = new UsersDto({
        ...req.user,
        ...req.body,
      });

      if (req.method === 'PATCH') {
        const userOld: UserEntity = await this.usersService.getUserByfield('id', userDtoUpdate.id);

        let errors = '';

        if (userDtoUpdate.email !== userOld.email) {
          const user: UserEntity = await this.usersService.getUserByfield('email', userDtoUpdate.email);

          if (user) {
            errors = `האמייל ${userDtoUpdate.email} כבר קיים במערכת `;
          }
        } else if (userOld.companies[0].businessId !== userDtoUpdate.companies[0].businessId) {
          const user: UserEntity = await this.usersService.getUserByCompanyfield('businessId', userDtoUpdate.companies[0].businessId);
          if (user) {
            errors += `הח.פ ${userDtoUpdate.companies[0].businessId} כבר קיים במערכת `;
          }
        }

        if (errors) {
          throw new BadRequest(errors);
        }
      }

      const userUpdated: UsersDto = await this.usersService.updateUser(userDtoUpdate);

      const userResponse = instanceToPlain(userUpdated);

      res.send(userResponse);
    } catch (error) {
      next(error);
    }
  }
}
