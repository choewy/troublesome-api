import { Module } from '@nestjs/common';

import { FulfillmentController } from './fulfillment.controller';
import { FulfillmentService } from './fulfillment.service';

import { DeliveryCompanyRepository } from '@/domain/delivery-company/delivery-company.repository';
import { DeliveryCompanySettingRepository } from '@/domain/delivery-company-setting/delivery-company-setting.repository';
import { FulfillmentRepository } from '@/domain/fulfillment/fulfillment.repository';
import { PermissionRepository } from '@/domain/permission/permission.repository';
import { RoleRepository } from '@/domain/role/role.repository';
import { UserRepository } from '@/domain/user/user.repository';

@Module({
  controllers: [FulfillmentController],
  providers: [
    FulfillmentService,
    FulfillmentRepository,
    UserRepository,
    DeliveryCompanyRepository,
    DeliveryCompanySettingRepository,
    RoleRepository,
    PermissionRepository,
  ],
})
export class FulfillmentModule {}
