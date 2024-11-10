import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';

import { GetUserListParamsDTO } from './dto/get-user-list-param.dto';
import { UserListDTO } from './dto/user-list.dto';
import { UserSearchKeywordField } from './enums';
import { User } from './user.entity';

import { PasswordService } from '@/common/password/password.service';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<User>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly passwordService: PasswordService,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  private get userQueryBuilder() {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany('user.roleJoin', 'user.roleJoin', 'roleJoin')
      .leftJoinAndMapOne('roleJoin.role', 'roleJoin.role', 'role')
      .leftJoinAndMapMany('role.permissions', 'role.permissions', 'permissions')
      .where('1 = 1');
  }

  private createUserSearchKeywordBracket(field: UserSearchKeywordField, keyword: string) {
    return new Brackets((qb) => {
      qb.where('1 = 1');

      switch (field) {
        case UserSearchKeywordField.Email:
          qb.orWhere('user.email LIKE "%:keyword%"', { keyword });

          break;

        case UserSearchKeywordField.Name:
          qb.orWhere('user.name LIKE "%:keyword%"', { keyword });

          break;

        default:
          qb.orWhere('user.email LIKE "%:keyword%"', { keyword });
          qb.orWhere('user.name LIKE "%:keyword%"', { keyword });

          break;
      }

      return qb;
    });
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: string) {
    return this.userQueryBuilder.andWhere('user.id = :id', { id }).getOne();
  }

  async getUserList(params: GetUserListParamsDTO) {
    const builder = this.userQueryBuilder;

    if (params.type) {
      builder.andWhere('user.type = :type', { type: params.type });
    }

    if (params.status) {
      builder.andWhere('user.status = :status', { status: params.status });
    }

    if (params.keyword) {
      builder.andWhere(this.createUserSearchKeywordBracket(params.field, params.keyword));
    }

    const [users, total] = await builder.skip(params.skip).take(params.take).getManyAndCount();

    return new UserListDTO(users, total, params);
  }
}
