import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

import { ToString } from '@/constant/transformers';

export class DeleteRoleDTO {
  @ApiProperty({ type: BigInt })
  @IsNumberString()
  @IsNotEmpty()
  @ToString()
  id: string;
}
