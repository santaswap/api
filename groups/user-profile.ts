import { User } from '../users';
import { Group } from './group';

export class UserProfile {
  groupId: string;
  type: string = 'USER:';
  name: string;
  address: string;
  giftIdeas: string;
  targetUserId: string;
  excludedUserIds: string[];

  constructor(group: Group, user: User) {
    this.groupId = group.groupId;
    this.name = user.name;
    this.type += user.userId;
  }
}
