import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, PrimaryColumn, CreateDateColumn, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { CampaignEntity } from '../campiagns/campaigns.entity';

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nameForTaxInvoice: string;

  @Column()
  businessId: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => CampaignEntity, (campaign) => campaign.company)
  campaigns: CampaignEntity[];

  @ManyToMany(() => UserEntity, (user) => user.companies)
  @JoinTable()
  users?: UserEntity[];
}
