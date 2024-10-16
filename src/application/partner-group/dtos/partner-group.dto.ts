import { ApiProperty } from '@nestjs/swagger';

import { PartnerGroupManagerDTO } from './partner-group-manager.dto';
import { PartnerGroupPartnerDTO } from './partner-group-partner.dto';

import { PartnerGroupEntity } from '@/domain/partner-group/partner-group.entity';

export class PartnerGroupDTO {
  @ApiProperty({ type: Number, description: '고객사 그룹 PK' })
  id: number;

  @ApiProperty({ type: String, description: '고객사 그룹 이름' })
  name: string;

  @ApiProperty({ type: Date, description: '등록일시' })
  createdAt: Date;

  @ApiProperty({ type: PartnerGroupManagerDTO, description: '고객사 그룹 관리자 정보' })
  manager: PartnerGroupManagerDTO | null;

  @ApiProperty({ type: [PartnerGroupPartnerDTO], description: '고객사 목록' })
  partners: PartnerGroupPartnerDTO[];

  constructor(partnerGroup: PartnerGroupEntity) {
    this.id = partnerGroup.id;
    this.name = partnerGroup.name;
    this.createdAt = partnerGroup.createdAt;
    this.manager = null;
    this.partners = [];

    if (partnerGroup.manager) {
      this.manager = new PartnerGroupManagerDTO(partnerGroup.manager);
    }

    for (const partner of partnerGroup.partners) {
      this.partners.push(new PartnerGroupPartnerDTO(partner));
    }
  }
}
