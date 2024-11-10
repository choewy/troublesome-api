import { UserDTO } from './user.dto';

import { ListResponseBuilder } from '@/common/builder/list-response.builder';

export class UserListDTO extends ListResponseBuilder(UserDTO) {}