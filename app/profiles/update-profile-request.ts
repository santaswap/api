const PROFILE_TYPE_PREFIX = 'USER:';

export class UpdateProfileRequest {
  groupId: string;
  type: string;
  userId: string;
  name: string;
  address: string;
  giftIdeas: string;

  constructor({ groupId, userId, name, address, giftIdeas }: UpdateProfileRequestConstructor) {
    this.groupId = groupId;
    this.name = name;
    this.userId = userId;
    this.type = `${PROFILE_TYPE_PREFIX}${userId}`;
    this.address = address;
    this.giftIdeas = giftIdeas;
  }
}

interface UpdateProfileRequestConstructor {
  groupId: string;
  userId: string;
  name: string;
  address: string;
  giftIdeas: string;
}
