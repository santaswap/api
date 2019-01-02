import { Group } from './group';
import { User } from './user';

const USER_TYPE_PREFIX = 'USER:';

export class CreateProfileRequest {
  groupId: string;
  type: string;
  userId: string;
  name: string;

  constructor(group: Group, user: User) {
    this.groupId = group.groupId;
    this.name = user.name;
    this.type = `${USER_TYPE_PREFIX}${user.userId}`;
  }
}
