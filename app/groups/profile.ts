import { GroupRecord } from './group';
import { User } from './user';

export const PROFILE_TYPE_PREFIX = 'USER:';

export class ProfileRecord {
  groupId: string;
  userId: string;
  type: string;
  name: string;
  giftIdeas?: string;
  targetUserId?: string;
  excludedUserIds?: string[];

  constructor(record: any) {
    this.groupId = record.groupId;
    this.userId = record.userId;
    this.type = record.type;
    this.name = record.name;
    this.giftIdeas = record.giftIdeas;
    this.targetUserId = record.targetUserId;
    this.excludedUserIds = record.excludedUserIds;
  }

  getProfileResponse(): ProfileResponse {
    return {
      groupId: this.groupId,
      userId: this.userId,
      name: this.name,
      giftIdeas: this.giftIdeas,
      targetUserId: this.targetUserId,
      excludedUserIds: this.excludedUserIds
    };
  }
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
    this.type = `${PROFILE_TYPE_PREFIX}${user.userId}`;
  }
}
