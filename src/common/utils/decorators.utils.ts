import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator-multi-lang';
import { AppDataSource } from '../../db/data-source';
import { plainToClass } from 'class-transformer';
import { CampaignDto } from '../../campiagns/campaigns.dto';
import { BadRequest } from '../errors/general.error';

@ValidatorConstraint({ async: true })
export class UniqueOnDatabaseExistConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const entity = args.object[`class_entity_${args.property}`];

    const manager = AppDataSource.manager;

    const entityCount = await manager.count(entity, {
      where: { [args.property]: value },
    });

    return entityCount < 1;
  }
}

export function UniqueOnDatabase(entity: Function, validationOptions?: ValidationOptions) {
  validationOptions = {
    ...{ message: '$value כבר קיים אנא השתמש בערך אחר' },
    ...validationOptions,
  };
  return function (object: Object, propertyName: string) {
    object[`class_entity_${propertyName}`] = entity;
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueOnDatabaseExistConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsBudgetGreaterThanLimit', async: false })
export class IsBudgetGreaterThanLimitConstraint implements ValidatorConstraintInterface {
  validate(budget: number, args: ValidationArguments) {
    const dailyBudget = args.object[args.constraints[0]];
    return budget > dailyBudget;
  }

  defaultMessage(args: ValidationArguments) {
    return `התקציב חייב ליהיות גדול או שווה לתקציב היומי`;
  }
}

export function IsBudgetGreaterThanLimit(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBudgetGreaterThanLimit',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsBudgetGreaterThanLimitConstraint,
      constraints: ['dailyBudget'],
    });
  };
}
