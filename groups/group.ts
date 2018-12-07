import { v1 } from 'uuid';
import { UserProfile } from './user-profile';

export class Group {
  groupId: string;
  type: string = 'GROUP:';
  name: string;

  constructor(body: any) {
    this.groupId = v1();
    this.type += this.groupId;
    this.name = body.name;
  }
}

export class BasicGroupResponse {
  groupId: string;
  name: string;
  members: string[];

  constructor(group: Group, userProfiles: UserProfile[]) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.members = userProfiles.map(userProfile => userProfile.name);
  }
}
