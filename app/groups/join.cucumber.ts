import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { post } from 'request-promise';
import { Chance } from 'chance';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const chance = new Chance();
const URL = getDeployedUrl();
const TEST_NAME_PREFIX = 'TEST_USER';

@binding([SharedState])
export class JoinGroup {
  constructor(protected sharedState: SharedState) {}

  userRequest = { name: `${TEST_NAME_PREFIX}: ${chance.name()}` };
  groupResponse: any;

  @when(/another valid user create request is made/)
  public async createAnotherUser() {
    const params = {
      url: `${URL}/users`,
      method: 'post',
      simple: false,
      body: JSON.stringify(this.userRequest)
    };
    const userResponse = JSON.parse(await post(params));
    this.sharedState.anotherUserId = userResponse.userId;
  }

  @when(/a valid join request is made/)
  public async joinGroup() {
    const params = {
      url: `${URL}/groups/${this.sharedState.groupId}/users/${this.sharedState.anotherUserId}`,
      method: 'post',
      simple: false
    };
    const groupResponse = JSON.parse(await post(params));
    this.groupResponse = groupResponse;
    this.sharedState.joinedGroupId = groupResponse.groupId;
  }

  @then(/the API response will include the basic group response/)
  public validateJoin() {
    expect(this.groupResponse).to.not.equal(undefined);
    expect(this.groupResponse.groupId).to.equal(this.sharedState.groupId);
  }
}
