// import { User } from './user';
// import { Group } from './group';
// const PROFILE_TYPE_PREFIX = 'PROFILE:';
// export interface Profile {
//   groupId: string;
//   name: string;
// }
// export class ProfileRecord {
//   groupId: string;
//   userId: string;
//   name: string;
//   address: string;
//   giftIdeas: string;
//   targetUserId: string;
//   excludedUserIds: string[];
//   constructor(dynamoRecord) {
//     this.groupId = dynamoRecord.groupId;
//     this.userId = dynamoRecord.type.split(PROFILE_TYPE_PREFIX)[1];
//     this.name = dynamoRecord.name;
//     this.address = dynamoRecord.address;
//     this.giftIdeas = dynamoRecord.giftIdeas;
//     this.targetUserId = dynamoRecord.targetUserId;
//     // get set values from dynamo record or set as empty list
//     this.excludedUserIds = dynamoRecord.excludedUserIds ? dynamoRecord.excludedUserIds.values : [];
//   }
// }
// export class ProfileCreateRequest {
//   groupId: string;
//   type: string;
//   userId: string;
//   name: string;
//   constructor(group: Group, user: User) {
//     this.groupId = group.groupId;
//     this.name = user.name;
//     this.type = `${PROFILE_TYPE_PREFIX}${user.userId}`;
//   }
// }
//# sourceMappingURL=profile.old.js.map