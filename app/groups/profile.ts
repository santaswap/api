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
  test: boolean;
  recordExpiration: number;
  created: string;

  constructor(record: any) {
    this.groupId = record.groupId;
    this.userId = record.userId;
    this.type = record.type;
    this.name = record.name;
    this.giftIdeas = record.giftIdeas;
    this.targetUserId = record.targetUserId;
    this.excludedUserIds = record.excludedUserIds;
    this.recordExpiration = record.recordExpiration;
    this.created = record.created;
    this.test = record.test;
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
  test: boolean;
  recordExpiration: number;

  constructor(group: GroupRecord, user: User) {
    this.groupId = group.groupId;
    this.test = group.test;
    this.created = new Date().toUTCString();
    this.name = user.name;
    this.type = `${PROFILE_TYPE_PREFIX}${user.userId}`;
    if (group.test) {
      const MINUTES_TO_LIVE = 30;
      const MILLISECONDS_TO_LIVE = MINUTES_TO_LIVE * 60 * 1000;
      this.recordExpiration = Math.floor(new Date(Date.now() + MILLISECONDS_TO_LIVE).getTime() / 1000);
    }
  }
}
