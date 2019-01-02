import { ProfileRecord, ProfileResponse } from './profile';
import { v1 } from 'uuid';

export class CreateGroupRequest {
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
  members: string[] = [];

  constructor(group: GroupRecord, userProfiles?: ProfileRecord[]) {
    this.groupId = group.groupId;
    this.name = group.name;
    if (userProfiles && userProfiles.length) {
      this.members = userProfiles.map(userProfile => userProfile.name);
    }
  }
}

export class DetailedGroupResponse {
  groupId: string;
  name: string;
  members: ProfileResponse[];
  userProfile: ProfileResponse;

  constructor(group: GroupRecord, userProfiles: ProfileResponse[], userProfile: ProfileResponse) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.userProfile = userProfile;
    this.members = userProfiles.filter(up => up.userId !== userProfile.userId);
  }
}

export interface GroupRecord {
  groupId: string;
  name: string;
  code: string;
  type: string;
}
