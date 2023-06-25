import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, PrimaryColumn, RelationId, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';

import { CompanyEntity } from '../companies/company.entity';
import { CampaignStatusEnum } from '../common/enums/guestStatus.enum';
import { UserEntity } from '../users/users.entity';

@Entity('campaigns')
export class CampaignEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'bigint' })
  endDate: number;

  @Column({
    type: 'enum',
    enum: CampaignStatusEnum,
  })
  status: CampaignStatusEnum;

  @Column({ type: 'integer' })
  budget: number;

  @Column({ type: 'integer' })
  dailyBudget: number;

  @Column({ type: 'bigint' })
  createdAt: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @ManyToOne(() => CompanyEntity, (company) => company.campaigns)
  @JoinColumn({ name: 'companyId' })
  company?: CompanyEntity;
}
