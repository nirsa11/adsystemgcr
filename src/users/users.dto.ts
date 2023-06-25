import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator-multi-lang';
import { BaseDto } from '../common/abstract/dto.abstract';
import { UserEntity } from './users.entity';
import { CompanyEntity } from '../companies/company.entity';
import { v4 as uuidv4 } from 'uuid';
import { UniqueOnDatabase } from '../common/utils/decorators.utils';
import { CompaniesDto } from '../companies/companies.dto';
import { Exclude, Type } from 'class-transformer';
import { TokensEntity } from './forgotPassword/tokens.entity';

/**
 * Data transfer object for Users. This class is used to validate and transform user data
 * between the client and server.
 */
export class UsersDto extends BaseDto<UsersDto, UserEntity> {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @UniqueOnDatabase(UserEntity)
  email: string;

  @Exclude({ toPlainOnly: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber('IL')
  @IsNotEmpty()
  mobileNumber: string;

  @IsNumber()
  @IsNotEmpty()
  role: number;

  accessToken?: string;

  createdAt: Date;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @Type(() => CompaniesDto)
  companies: CompaniesDto[];

  constructor(user: UsersDto) {
    super();

    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.mobileNumber = user.mobileNumber;
    this.role = user.role;
    this.accessToken = user.accessToken;
    this.companies = user.companies?.map((company) => {
      return new CompaniesDto(company as CompaniesDto);
    });
    this.createdAt = user.createdAt;
  }
}

/**
 * A class representing a login data transfer object.
 * @class
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @constructor
 * @param {LoginDto} loginDto - The login data transfer object.
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  constructor(loginDto: LoginDto) {
    this.email = loginDto.email;
    this.password = loginDto.password;
  }
}

export class ForgotPasswordDto extends BaseDto<ForgotPasswordDto, TokensEntity> {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  constructor(dto: ForgotPasswordDto) {
    super();
    this.email = dto.email;
  }
}

/**
 * A DTO (Data Transfer Object) class for Tokens. This class extends the BaseDto class and
 * contains properties for the token's id, token string, expiration date, and user.
 * @extends BaseDto<TokensdDto, TokensEntity>
 * @property {number} id - The id of the token.
 * @property {string} token - The token string.
 * @property {number} expiredAt - The expiration date of the token.
 * @property {UsersDto} user - The user associated with the token.
 * @constructor
 * @param {TokensdDto} dto - The DTO object to create the TokensdDto from.
 */
export class TokensdDto extends BaseDto<TokensdDto, TokensEntity> {
  id: number;

  @IsString()
  token: string;

  expiredAt: number;

  user: UsersDto;

  constructor(dto: TokensdDto) {
    super();
    this.token = dto.token;
  }
}
