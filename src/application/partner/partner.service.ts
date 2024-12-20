import { BadRequestException, Injectable } from '@nestjs/common';
import { Brackets, DataSource, In, Repository } from 'typeorm';

import { CreatePartnerGroupDTO } from './dto/create-partner-group.dto';
import { CreatePartnerDTO } from './dto/create-partner.dto';
import { GetPartnerGroupListParamDTO } from './dto/get-partner-group-list-param.dto';
import { GetPartnerListParamDTO } from './dto/get-partner-list-param.dto';
import { PartnerExistByNameResultDTO } from './dto/partner-exist-by-name-result.dto';
import { PartnerGroupExistByNameResultDTO } from './dto/partner-group-exist-by-name-result.dto';
import { PartnerGroupListDTO } from './dto/partner-group-list.dto';
import { PartnerGroupDTO } from './dto/partner-group.dto';
import { PartnerListDTO } from './dto/partner-list.dto';
import { PartnerDTO } from './dto/patner.dto';
import { UpdatePartnerGroupPartnersDTO } from './dto/update-partner-group-partners.dto';
import { UpdatePartnerGroupDTO } from './dto/update-partner-group.dto';
import { UpdatePartnerUsersDTO } from './dto/update-partner-users.dto';
import { UpdatePartnerDTO } from './dto/update-partner.dto';
import { PartnerGroupSearchKeywordField, PartnerSearchKeywordField } from './enums';
import { PartnerGroup } from './partner-group.entity';
import { Partner } from './partner.entity';
import { Purchaser } from '../purchaser/purchaser.entity';
import { User } from '../user/user.entity';

@Injectable()
export class PartnerService {
  private readonly partnerGroupRepository: Repository<PartnerGroup>;
  private readonly partnerRepository: Repository<Partner>;

  constructor(private readonly dataSource: DataSource) {
    this.partnerGroupRepository = this.dataSource.getRepository(PartnerGroup);
    this.partnerRepository = this.dataSource.getRepository(Partner);
  }

  private get partnerGroupQueryBuilder() {
    return this.partnerGroupRepository
      .createQueryBuilder('partnerGroup')
      .leftJoinAndMapMany('partnerGroup.partners', 'partnerGroup.partners', 'partners')
      .where('1 = 1');
  }

  private createPartnerGroupSearchKeywordBracket(field: PartnerGroupSearchKeywordField, keyword: string) {
    return new Brackets((qb) => {
      qb.where('1 = 1');

      switch (field) {
        case PartnerGroupSearchKeywordField.Name:
          qb.orWhere('partnerGroup.name LIKE "%:keyword%"', { keyword });

          break;

        default:
          qb.orWhere('partnerGroup.name LIKE "%:keyword%"', { keyword });

          break;
      }

      return qb;
    });
  }

  async getPartnerGroupList(params: GetPartnerGroupListParamDTO) {
    const builder = this.partnerGroupQueryBuilder;

    if (params.keyword) {
      builder.andWhere(this.createPartnerGroupSearchKeywordBracket(params.field, params.keyword));
    }

    const [partnerGroups, total] = await builder.skip(params.skip).take(params.take).getManyAndCount();

    return new PartnerGroupListDTO(partnerGroups, total, params);
  }

  async checkExistPartnerGroupByName(name: string) {
    return new PartnerGroupExistByNameResultDTO(name, (await this.partnerGroupRepository.countBy({ name })) > 0);
  }

  async getPartnerGroupDetail(id: string) {
    const partnerGroup = await this.partnerGroupQueryBuilder.andWhere('partnerGroup.id = :id', { id }).getOne();

    if (partnerGroup === null) {
      throw new BadRequestException('not found partner group');
    }

    return new PartnerGroupDTO(partnerGroup);
  }

  async createPartnerGroup(body: CreatePartnerGroupDTO) {
    await this.partnerGroupRepository.save({
      name: body.name,
    });
  }

  async updatePartnerGroup(body: UpdatePartnerGroupDTO) {
    const partnerGroup = await this.partnerGroupRepository.findOne({
      where: { id: body.id },
    });

    if (partnerGroup === null || !body.name || body.name === partnerGroup.name) {
      return;
    }

    await this.partnerGroupRepository.update(body.id, { name: body.name });
  }

  async updatePartnerGroupPartners(body: UpdatePartnerGroupPartnersDTO) {
    await this.dataSource.transaction(async (em) => {
      const partnerGroupRepository = em.getRepository(PartnerGroup);
      const partnerGroup = await partnerGroupRepository.findOneBy({ id: body.id });

      if (partnerGroup === null) {
        return;
      }

      const partnerRepository = em.getRepository(Partner);

      if (Array.isArray(body.remove) && body.remove.length > 0) {
        await partnerRepository.update({ id: In(body.remove) }, { partnerGroup: null });
      }

      if (Array.isArray(body.append) && body.append.length > 9) {
        await partnerRepository.update({ id: In(body.append) }, { partnerGroup });
      }
    });
  }

  async deletePartnerGroups(ids: string[]) {
    await this.dataSource.transaction(async (em) => {
      const partnerGroupRepository = em.getRepository(PartnerGroup);
      const partnerGroups = await partnerGroupRepository.find({
        select: { id: true },
        where: { id: In(['0'].concat(ids)) },
      });

      const partnerGroupIds = ['0'].concat(partnerGroups.map(({ id }) => id));
      await partnerGroupRepository.softDelete({ id: In(partnerGroupIds) });

      const partnerRepository = em.getRepository(Partner);
      await partnerRepository.update({ partnerGroupId: In(partnerGroupIds) }, { partnerGroupId: null });
    });
  }

  private get partnerQueryBuilder() {
    return this.partnerRepository
      .createQueryBuilder('partner')
      .leftJoinAndMapMany('partner.partnerGroup', 'partner.partnerGroup', 'partnerGroup')
      .where('1 = 1');
  }

  private createPartnerSearchKeywordBracket(field: PartnerSearchKeywordField, keyword: string) {
    return new Brackets((qb) => {
      qb.where('1 = 1');

      switch (field) {
        case PartnerSearchKeywordField.Name:
          qb.orWhere('partner.name LIKE "%:keyword%"', { keyword });

          break;

        case PartnerSearchKeywordField.GroupName:
          qb.orWhere('partnerGroup.name LIKE "%:keyword%"', { keyword });

          break;

        default:
          qb.orWhere('partner.name LIKE "%:keyword%"', { keyword });
          qb.orWhere('partnerGroup.name LIKE "%:keyword%"', { keyword });

          break;
      }

      return qb;
    });
  }

  async hasPartnerById(id: string) {
    return (await this.partnerRepository.count({ select: { id: true }, where: { id }, take: 1 })) > 0;
  }

  async getPartnerList(params: GetPartnerListParamDTO) {
    const builder = this.partnerQueryBuilder;

    if (params.keyword) {
      builder.andWhere(this.createPartnerSearchKeywordBracket(params.field, params.keyword));
    }

    const [partners, total] = await builder.skip(params.skip).take(params.take).getManyAndCount();

    return new PartnerListDTO(partners, total, params);
  }

  async getPartnerDetail(id: string) {
    const partner = await this.partnerQueryBuilder.andWhere('partner.id = :id', { id }).getOne();

    if (partner === null) {
      throw new BadRequestException('not found partner');
    }

    return new PartnerDTO(partner);
  }

  async checkExistPartnerByName(partnerGroupId: string, name: string) {
    return new PartnerExistByNameResultDTO(partnerGroupId, name, (await this.partnerRepository.countBy({ partnerGroupId, name })) > 0);
  }

  async createPartner(body: CreatePartnerDTO) {
    await this.partnerRepository.save({
      partnerGroupId: body.partnerGroupId,
      name: body.name,
    });
  }

  async updatePartner(body: UpdatePartnerDTO) {
    const partner = await this.partnerRepository.findOneBy({ id: body.id });

    if (partner === null || !body.name || body.name === partner.name) {
      return;
    }

    await this.partnerRepository.update(body.id, { name: body.name });
  }

  async updatePartnerUsers(body: UpdatePartnerUsersDTO) {
    await this.dataSource.transaction(async (em) => {
      const partnerRepository = em.getRepository(Partner);
      const partner = await partnerRepository.findOneBy({ id: body.id });

      if (partner === null) {
        return;
      }

      const userRepository = em.getRepository(User);

      if (Array.isArray(body.remove) && body.remove.length > 0) {
        await userRepository.update({ id: In(body.remove) }, { partner: null });
      }

      if (Array.isArray(body.append) && body.append.length > 9) {
        await userRepository.update({ id: In(body.append) }, { partner });
      }
    });
  }

  async deletePartners(ids: string[]) {
    await this.dataSource.transaction(async (em) => {
      const partnerRepository = em.getRepository(Partner);
      const partners = await partnerRepository.find({
        select: { id: true },
        where: { id: In(['0'].concat(ids)) },
      });

      const partnerIds = ['0'].concat(partners.map(({ id }) => id));
      await partnerRepository.softDelete({ id: In(partnerIds) });

      const userRepository = em.getRepository(User);
      await userRepository.update({ partnerId: In(partnerIds) }, { partner: null });

      const purchaserRepository = em.getRepository(Purchaser);
      await purchaserRepository.update({ partnerId: In(partnerIds) }, { partner: null });
    });
  }
}
