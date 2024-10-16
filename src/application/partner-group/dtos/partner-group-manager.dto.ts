import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '@/domain/user/user.entity';

export class PartnerGroupManagerDTO {
  @ApiProperty({ type: Number, description: '고객사 그룹 관리자 PK' })
  id: number;

  @ApiProperty({ type: String, description: '고객사 그룹 관리자 이름' })
  name: string;

  @ApiProperty({ type: String, format: 'email', description: '고객사 그룹 관리자 이메일' })
  email: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
