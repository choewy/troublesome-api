import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserStatus, UserType } from './enums';
import { UserTokenClaimType } from './types';
import { Fulfillment } from '../fulfillment/fulfillment.entity';
import { Partner } from '../partner/partner.entity';
import { RoleUsers } from '../role/role-users.entity';

@Entity({ name: 'user', comment: '사용자' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '사용자 PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 10, comment: '구분' })
  type: UserType;

  @Column({ type: 'varchar', length: 340, comment: '이메일' })
  email: string;

  @Column({ type: 'varchar', length: 255, comment: '비밀번호' })
  password: string;

  @Column({ type: 'varchar', length: 50, comment: '이름' })
  name: string;

  @Column({ type: 'varchar', length: 10, default: UserStatus.Activated, comment: '상태' })
  status: UserStatus;

  @OneToMany(() => RoleUsers, (e) => e.user, { cascade: true })
  @JoinTable()
  roleJoin: RoleUsers[];

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  partnerId: string;

  @ManyToOne(() => Partner, (e) => e.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  partner: Partner;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  fulfillmentId: string;

  @ManyToOne(() => Fulfillment, (e) => e.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  fulfillment: Fulfillment;

  @CreateDateColumn({ type: 'timestamp', comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '수정일시' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', comment: '삭제일시' })
  readonly deletedAt: Date | null;

  public toClaim(): UserTokenClaimType {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      email: this.email,
    };
  }
}
