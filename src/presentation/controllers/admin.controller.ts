import { Controller } from '@nestjs/common';

import { AdminService } from '@/application';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
