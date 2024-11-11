import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PartnerService } from './partner.service';
import { RolePermissionKey } from '../role/enums';
import { CheckExistPartnerGroupByNameParamDTO } from './dto/check-exist-partner-group-by-name-param.dto';
import { GetPartnerGroupListParamDTO } from './dto/get-partner-group-list-param.dto';
import { GetPartnerGroupParamDTO } from './dto/get-partner-group-param.dto';
import { GetPartnerListParamDTO } from './dto/get-partner-list-param.dto';
import { GetPartnerParamDTO } from './dto/get-partner-param.dto';
import { PartnerGroupExistByNameResultDTO } from './dto/partner-group-exist-by-name-result.dto';
import { PartnerGroupListDTO } from './dto/partner-group-list.dto';
import { PartnerListDTO } from './dto/partner-list.dto';
import { PartnerDTO } from './dto/patner.dto';

import { Permission, Public } from '@/constant/decorators';

@Public()
@ApiTags('고객사')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Permission(RolePermissionKey.PartnerList)
  @Get('list')
  @ApiOperation({ summary: '고객사 목록 검색 조회' })
  @ApiOkResponse({ type: PartnerListDTO })
  async getPartnerList(@Query() queryParam: GetPartnerListParamDTO) {
    return this.partnerService.getPartnerList(queryParam);
  }

  @Permission(RolePermissionKey.PartnerRead)
  @Get('detail/:id')
  @ApiOperation({ summary: '고객사 조회' })
  @ApiOkResponse({ type: PartnerDTO })
  async getPartnerDetail(@Param() param: GetPartnerParamDTO) {
    return param;
  }

  @Permission(RolePermissionKey.PartnerCreate)
  @Post('create')
  @ApiOperation({ summary: '고객사 등록' })
  @ApiCreatedResponse()
  async createPartner() {
    return;
  }

  @Permission(RolePermissionKey.PartnerUpdate)
  @Patch('update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '고객사 수정' })
  @ApiNoContentResponse()
  async updatePartner() {
    return;
  }

  @Permission(RolePermissionKey.PartnerUserUpdate)
  @Patch('update/users')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '고객사 사용자 추가/삭제' })
  @ApiNoContentResponse()
  async updatePartnerUsers() {
    return;
  }

  @Permission(RolePermissionKey.PartnerDelete)
  @Put('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '고객사 삭제' })
  @ApiNoContentResponse()
  async deletePartner() {
    return;
  }

  @Permission(RolePermissionKey.PartnerDelete)
  @Put('delete/many')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '고객사 삭제' })
  @ApiNoContentResponse()
  async deletePartners() {
    return;
  }

  @Permission(RolePermissionKey.PartnerGroupList)
  @Get('groups/list')
  @ApiOperation({ summary: '고객사 그룹 목록 검색 조회' })
  @ApiOkResponse({ type: PartnerGroupListDTO })
  async getPartnerGroupList(@Query() queryParam: GetPartnerGroupListParamDTO) {
    return this.partnerService.getPartnerGroupList(queryParam);
  }

  @Permission(RolePermissionKey.PartnerRead)
  @Get('exist')
  @ApiOperation({ summary: '고객사 그룹명 중복 여부 확인' })
  @ApiOkResponse({ type: PartnerGroupExistByNameResultDTO })
  async checkExistRoleByName(@Query() queryParam: CheckExistPartnerGroupByNameParamDTO) {
    return this.partnerService.checkExistPartnerGroupByName(queryParam.name);
  }

  @Permission(RolePermissionKey.PartnerGroupRead)
  @Get('groups/detail/:id')
  @ApiOperation({ summary: '고객사 그룹 조회' })
  @ApiOkResponse()
  async getPartnerGroupDetail(@Param() param: GetPartnerGroupParamDTO) {
    return param;
  }

  @Permission(RolePermissionKey.PartnerGroupCreate)
  @Post('groups/create')
  @ApiOperation({ summary: '고객사 그룹 생성' })
  @ApiCreatedResponse()
  async createPartnerGroup() {
    return;
  }

  @Permission(RolePermissionKey.PartnerGroupUpdate)
  @Patch('groups/update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '고객사 그룹 수정' })
  @ApiNoContentResponse()
  async updatePartnerGroup() {
    return;
  }

  @Permission(RolePermissionKey.PartnerGroupPartnerUpdate)
  @Put('groups/partners')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '고객사 그룹 고객사 추가/삭제' })
  @ApiNoContentResponse()
  async updatePartnerGroupPartners() {
    return;
  }

  @Permission(RolePermissionKey.PartnerGroupDelete)
  @Put('groups/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '고객사 그룹 삭제' })
  @ApiNoContentResponse()
  async deletePartnerGroup() {
    return;
  }

  @Permission(RolePermissionKey.PartnerGroupDelete)
  @Put('groups/delete/many')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '고객사 그룹 삭제' })
  @ApiNoContentResponse()
  async deletePartnerGroups() {
    return;
  }
}
