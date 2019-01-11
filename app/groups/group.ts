import { v4 } from 'uuid';
import { Chance } from 'chance';
import { ProfileRecord, DetailedProfileResponse, BasicProfileResponse } from './profile';

export const GROUP_TYPE_PREFIX = 'GROUP';
const chance = new Chance();

export class CreateGroupRequest {
  groupId: string;
  type: string;
  name: string;
  code: string;
  created: string;
  updated: string;
  testRequest: boolean;
  recordExpiration: number;
  matched: boolean;

  constructor(body: any, testRequest: boolean) {
    this.groupId = v4();
    this.created = new Date().toUTCString();
    this.type = GROUP_TYPE_PREFIX;
    this.name = body.name;
    this.code = chance.word({ length: 5 }).toUpperCase();
    this.matched = false;
    this.testRequest = testRequest;
    if (testRequest) {
      const MINUTES_TO_LIVE = 30;
      const MILLISECONDS_TO_LIVE = MINUTES_TO_LIVE * 60 * 1000;
      this.recordExpiration = Math.floor(new Date(Date.now() + MILLISECONDS_TO_LIVE).getTime() / 1000);
    }
  }
}

export class BasicGroupResponse {
  groupId: string;
  name: string;
  code: string;
  members: string[] = [];
  matched: boolean;

  constructor(group: GroupRecord, userProfiles?: ProfileRecord[]) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.code = group.code;
    this.matched = group.matched;
    if (userProfiles && userProfiles.length) {
      this.members = userProfiles.map(userProfile => userProfile.name);
    }
  }
}

export class DetailedGroupResponse {
  groupId: string;
  name: string;
  code: string;
  members: BasicProfileResponse[];
  profile: DetailedProfileResponse;
  matched: boolean;

  constructor(group: GroupRecord, userProfiles: BasicProfileResponse[], profile: DetailedProfileResponse) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.code = group.code;
    this.profile = profile;
    this.members = userProfiles;
    this.matched = group.matched;
  }
}

export class GroupRecord {
  groupId: string;
  name: string;
  type: string;
  code: string;
  matched: boolean;
  created: string;
  testRequest: boolean;
  recordExpiration: number;

  constructor(record: any) {
    this.groupId = record.groupId;
    this.name = record.name;
    this.type = record.type;
    this.code = record.code;
    this.created = record.created;
    this.recordExpiration = record.recordExpiration;
    this.testRequest = record.testRequest;
    this.matched = record.matched;
  }
}
