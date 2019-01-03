import { v4 } from 'uuid';
import { Chance } from 'chance';
import { ProfileRecord, ProfileResponse } from './profile';

export const GROUP_TYPE_PREFIX = 'GROUP';
const chance = new Chance();

export class CreateGroupRequest {
  groupId: string;
  type: string;
  name: string;
  code: string;
  created: string;

  constructor(body: any) {
    this.groupId = v4();
    this.created = new Date().toUTCString();
    this.type = GROUP_TYPE_PREFIX;
    this.name = body.name;
    this.code = chance.word({ length: 5 }).toUpperCase();
  }
}

export class BasicGroupResponse {
  groupId: string;
  name: string;
  code: string;
  members: string[] = [];

  constructor(group: GroupRecord, userProfiles?: ProfileRecord[]) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.code = group.code;
    if (userProfiles && userProfiles.length) {
      this.members = userProfiles.map(userProfile => userProfile.name);
    }
  }
}

export class DetailedGroupResponse {
  groupId: string;
  name: string;
  code: string;
  members: ProfileResponse[];
  userProfile: ProfileResponse;

  constructor(group: GroupRecord, userProfiles: ProfileResponse[], userProfile: ProfileResponse) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.code = group.code;
    this.userProfile = userProfile;
    this.members = userProfiles.filter(up => up.userId !== userProfile.userId);
  }
}

export class GroupRecord {
  groupId: string;
  name: string;
  type: string;
  code: string;
  created: string;

  constructor(record: any) {
    this.groupId = record.groupId;
    this.name = record.name;
    this.type = record.type;
    this.code = record.code;
    this.created = record.created;
  }
}
