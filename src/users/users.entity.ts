import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, PrimaryColumn, RelationId, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';

import { CompanyEntity } from '../companies/company.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  mobileNumber: string;

  @Column()
  role: number;

  @ManyToMany(() => CompanyEntity)
  @JoinTable()
  companies: CompanyEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
