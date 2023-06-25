import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  RelationId,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { CompanyEntity } from "../../companies/company.entity";
import { UserEntity } from "../users.entity";

@Entity("forogt_password_tokens")
export class TokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  token: string;

  @Column("bigint")
  expiredAt: number;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
