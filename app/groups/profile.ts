import { GroupRecord } from './group';
import { User } from './user';

export const PROFILE_TYPE_PREFIX = 'USER:';

export class ProfileRecord {
  groupId: string;
  userId: string;
  type: string;
  name: string;
  giftIdeas?: string;
  address: string;
  targetUserId?: string;
  excludedUserIds?: string[];
  testRequest: boolean;
  recordExpiration: number;
  created: string;

  constructor(record: any, exclusions?: any[]) {
    this.groupId = record.groupId;
    this.userId = record.userId;
    this.type = record.type;
    this.name = record.name;
    this.giftIdeas = record.giftIdeas;
    this.address = record.address;
    this.targetUserId = record.targetUserId;
    this.recordExpiration = record.recordExpiration;
    this.created = record.created;
    this.testRequest = record.testRequest;
    this.excludedUserIds = exclusions ? exclusions.map(exclusion => exclusion.excludedUserId) : [];
  }

  getDetailedProfileResponse(): DetailedProfileResponse {
    return {
      userId: this.userId,
      name: this.name,
      giftIdeas: this.giftIdeas ? this.giftIdeas : '',
      address: this.address ? this.address : '',
      targetUserId: this.targetUserId,
      excludedUserIds: this.excludedUserIds
    };
  }

  getBasicProfileResponse(): BasicProfileResponse {
    return {
      userId: this.userId,
      name: this.name
    };
  }
}

export interface DetailedProfileResponse {
  userId: string;
  name: string;
  giftIdeas: string;
  address: string;
  targetUserId: string;
  excludedUserIds: string[];
}

export interface BasicProfileResponse {
  userId: string;
  name: string;
}

export class CreateProfileRequest {
  groupId: string;
  type: string;
  userId: string;
  name: string;
  created: string;
  testRequest: boolean;
  recordExpiration: number;

  constructor(group: GroupRecord, user: User) {
    this.groupId = group.groupId;
    this.testRequest = group.testRequest;
    this.created = new Date().toUTCString();
    this.name = user.name;
    this.type = `${PROFILE_TYPE_PREFIX}${user.userId}`;
    this.userId = user.userId;
    if (group.testRequest) {
      const MINUTES_TO_LIVE = 30;
      const MILLISECONDS_TO_LIVE = MINUTES_TO_LIVE * 60 * 1000;
      this.recordExpiration = Math.floor(new Date(Date.now() + MILLISECONDS_TO_LIVE).getTime() / 1000);
    }
  }
}

export class UpdateProfileMatchRequest {
  groupId: string;
  type: string;
  userId: string;
  recipientUserId: string;
  constructor({ groupId, userId, recipientUserId }: UpdateProfileMatchRequestConstructor) {
    this.groupId = groupId;
    this.userId = userId;
    this.type = `${PROFILE_TYPE_PREFIX}${userId}`;
    this.recipientUserId = recipientUserId;
  }
}

interface UpdateProfileMatchRequestConstructor {
  groupId: string;
  userId: string;
  recipientUserId: string;
}
