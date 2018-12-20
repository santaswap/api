import { User } from '../users';
import { Group } from './group';

const USER_TYPE_PREFIX = 'USER:';

interface UserProfile {
  groupId: string;
  name: string;
}

export class UserProfileRecord implements UserProfile {
  groupId: string;
  userId: string;
  name: string;
  address: string;
  giftIdeas: string;
  targetUserId: string;
  excludedUserIds: string[];

  constructor(dynamoRecord) {
    this.groupId = dynamoRecord.groupId;
    this.userId = dynamoRecord.type.split(USER_TYPE_PREFIX)[1];
    this.name = dynamoRecord.name;
    this.address = dynamoRecord.address;
    this.giftIdeas = dynamoRecord.giftIdeas;
    this.targetUserId = dynamoRecord.targetUserId;
    // get set values from dynamo record or set as empty list
    this.excludedUserIds = dynamoRecord.excludedUserIds ? dynamoRecord.excludedUserIds.values : [];
  }
}

export class UserProfileCreateRequest implements UserProfile {
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

export class UserProfileUpdateRequest implements UserProfile {
  groupId: string;
  type: string;
  userId: string;
  name: string;
  address: string;
  giftIdeas: string;

  constructor({ groupId, userId, name, address, giftIdeas }: UpdateUserProfileRequestConstructor) {
    this.groupId = groupId;
    this.name = name;
    this.userId = userId;
    this.type = `${USER_TYPE_PREFIX}${userId}`;
    this.address = address;
    this.giftIdeas = giftIdeas;
  }
}

interface UpdateUserProfileRequestConstructor {
  groupId: string;
  userId: string;
  name: string;
  address: string;
  giftIdeas: string;
}

export class UserProfileResponse implements UserProfile {
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
