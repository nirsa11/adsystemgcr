import {
  Repository,
  ObjectType,
  DeepPartial,
  FindOptions,
  FindOneOptions,
  UpdateResult,
} from "typeorm";

export class BaseRepository<T> extends Repository<T> {
  // async findById(id: number): Promise<T | undefined> {
  //   return this.findOne(id);
  // }
  // async findOneByConditions(
  //   conditions: FindOptions<T>,
  //   options?: FindOneOptions<T>
  // ): Promise<T | undefined> {
  //   return this.findOne(conditions, options);
  // }
  // async createEntity(entity: DeepPartial<T>): Promise<T> {
  //   const newEntity = this.create(entity);
  //   return this.save(newEntity);
  // }
  // async updateEntity(
  //   id: number,
  //   partialEntity: DeepPartial<T>
  // ): Promise<UpdateResult> {
  //   return this.update(id, partialEntity);
  // }
  // async deleteEntity(id: number): Promise<void> {
  //   await this.delete(id);
  // }
  // async findAll(): Promise<T[]> {
  //   return this.find();
  // }
}
