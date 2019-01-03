import { GroupRecord } from './group';
import { User } from './user';

const USER_TYPE_PREFIX = 'USER:';

export interface ProfileRecord {
  groupId: string;
  userId: string;
  name: string;
  giftIdeas?: string;
  targetUserId?: string;
  excludedUserIds?: string[];
}

export class ProfileResponse {
  groupId: string;
  userId: string;
  name: string;
  giftIdeas: string;
  targetUserId: string;
  excludedUserIds: string[];

  constructor(group: any, user: User) {
    this.groupId = group.groupId;
    this.name = user.name;
  }
}

export class CreateProfileRequest {
  groupId: string;
  type: string;
  userId: string;
  name: string;
  created: string;

  constructor(group: GroupRecord, user: User) {
    this.groupId = group.groupId;
    this.created = new Date().toUTCString();
    this.name = user.name;
    this.type = `${USER_TYPE_PREFIX}${user.userId}`;
  }
}
