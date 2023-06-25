import { Validator } from "../helpers/validator.helper";

/**
 * Base class for DTOs (Data Transfer Objects) and Entities. Provides methods for validation,
 * conversion between DTOs and Entities, and getting DTOs from Entities.
 * @template Dto - The DTO type
 * @template Entity - The Entity type
 */
export abstract class BaseDto<Dto, Entity> {
  protected dto: Dto;
  protected entity: Entity;

  async validate(dto: Dto) {
    await Validator.validate(dto);
  }
  async validateUpdate(dto: Partial<Dto>) {
    await Validator.validatePartial(dto);
  }

  fromEntity(): Dto {
    let dto = {} as Dto;

    Object.assign(dto, this) as Dto;

    return { ...dto };
  }

  toEntity(): Entity {
    let entity = {} as Entity;

    Object.assign(entity, this) as Entity;

    for (let col in entity) {
      if (typeof entity[col] === "object" && !Array.isArray(entity[col])) {
        entity[col] = { ...entity[col] };
      }
      entity[col] = entity[col];
    }

    return { ...entity };
  }

  getDto(entity: Entity): Dto {
    let dto = {} as Dto;

    Object.assign(dto, entity) as Dto;

    return { ...dto };
  }
}
