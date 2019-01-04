import { PROFILE_TYPE_PREFIX } from '../groups/profile';

export const EXCLUSION_TYPE_PREFIX = 'EXCLUSION:';

export class CreateExclusionRequest {
  groupId: string;
  type: string;
  userId: string;
  excludedUserId: string;
  created: string;
  testRequest: boolean;
  recordExpiration: number;

  constructor(groupId: string, userId: string, excludedUserId: string, testRequest: boolean) {
    this.groupId = groupId;
    this.type = `${PROFILE_TYPE_PREFIX}${userId}${EXCLUSION_TYPE_PREFIX}${excludedUserId}`;
    this.userId = userId;
    this.excludedUserId = excludedUserId;
    this.created = new Date().toUTCString();
    this.testRequest = testRequest;
    if (testRequest) {
      const MINUTES_TO_LIVE = 30;
      const MILLISECONDS_TO_LIVE = MINUTES_TO_LIVE * 60 * 1000;
      this.recordExpiration = Math.floor(new Date(Date.now() + MILLISECONDS_TO_LIVE).getTime() / 1000);
    }
  }
}
