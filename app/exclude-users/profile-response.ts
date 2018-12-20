import { Group } from './group';
import { User } from './user';

export class ProfileResponse {
  groupId: string;
  userId: string;
  name: string;
  giftIdeas: string;
  targetUserId: string;
  excludedUserIds: string[];

  constructor(group: Group, user: User) {
    this.groupId = group.groupId;
    this.name = user.name;
  }
}
