import { v1 } from 'uuid';
import { UserProfileResponse } from './user-profile';

export interface Group {
  groupId: string;
  name: string;
}

export class CreateGroupRequest implements Group {
  groupId: string;
  type: string = 'GROUP:';
  name: string;

  constructor(body: any) {
    this.groupId = v1();
    this.type += this.groupId;
    this.name = body.name;
  }
}

export interface GroupRecord extends Group {
  groupId: string;
  name: string;
  type: string;
}

export class BasicGroupResponse implements Group {
  groupId: string;
  name: string;
  members: string[];

  constructor(group: Group, userProfiles: UserProfileResponse[]) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.members = userProfiles.map(userProfile => userProfile.name);
  }
}

export class DetailedGroupResponse implements Group {
  groupId: string;
  name: string;
  members: UserProfileResponse[];
  userProfile: UserProfileResponse;

  constructor(group: Group, userProfiles: UserProfileResponse[], userProfile: UserProfileResponse) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.userProfile = userProfile;
    this.members = userProfiles.filter(up => up.userId !== userProfile.userId);
  }
}
