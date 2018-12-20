import { Group } from './group';
import { ProfileResponse } from './profile-response';

export class BasicGroupResponse implements Group {
  groupId: string;
  name: string;
  members: string[];

  constructor(group: Group, userProfiles: ProfileResponse[]) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.members = userProfiles.map(userProfile => userProfile.name);
  }
}
