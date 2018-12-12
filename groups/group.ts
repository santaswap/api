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
  type: string;
  name: string;
  members: string[];

  constructor(group: Group, userProfiles: UserProfile[]) {
    this.groupId = group.groupId;
    this.type = group.type;
    this.name = group.name;
    this.members = userProfiles.map(userProfile => userProfile.name);
  }
}

export class DetailedGroupResponse {
  groupId: string;
  name: string;
  members: UserProfile[];
  userProfile: UserProfile;

  constructor(group: Group, userProfiles: UserProfile[], userProfile: UserProfile) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.userProfile = userProfile;
    this.members = userProfiles.filter(up => up.userId !== userProfile.userId);
  }
}
