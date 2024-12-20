import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RolePermission } from './role-permission.entity';
import { RoleUsers } from './role-users.entity';

@Entity({ name: 'role', comment: '역할' })
export class Role {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '역할 PK' })
  readonly id: string;

  @Column({ type: 'varchar', length: 50, comment: '이름' })
  name: string;

  @Column({ type: 'boolean', default: true, comment: '수정가능여부' })
  editable: boolean;

  @OneToMany(() => RolePermission, (e) => e.role, { cascade: true })
  @JoinTable()
  permissions: RolePermission[];

  @OneToMany(() => RoleUsers, (e) => e.role, { cascade: true })
  @JoinTable()
  userJoin: RoleUsers[];

  @CreateDateColumn({ type: 'timestamp', comment: '생성일시' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '수정일시' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', comment: '삭제일시' })
  readonly deletedAt: Date | null;
}
