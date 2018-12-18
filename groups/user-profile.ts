import { User } from '../users';
import { Group } from './group';

interface UserProfile {
  groupId: string;
  name: string;
}

export interface UserProfileRecord extends UserProfile {
  groupId: string;
  type: string;
  name: string;
}

export class CreateUserProfileRequest implements UserProfile {
  groupId: string;
  type: string = 'USER:';
  userId: string;
  name: string;

  constructor(group: Group, user: User) {
    this.groupId = group.groupId;
    this.name = user.name;
    this.type += user.userId;
  }
}

export class UpdateUserProfileRequest implements UserProfile {
  groupId: string;
  type: string = 'USER:';
  userId: string;
  name: string;
  address: string;
  giftIdeas: string;

  constructor({ groupId, userId, name, address, giftIdeas }: UpdateUserProfileRequestConstructor) {
    this.groupId = groupId;
    this.name = name;
    this.userId = userId;
    this.type += userId;
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
