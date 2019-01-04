import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { post } from 'request-promise';
import { Chance } from 'chance';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const chance = new Chance();
const URL = getDeployedUrl();
const TEST_NAME_PREFIX = 'TEST_USER';
const TIMEOUT = 10000;

@binding([SharedState])
export class JoinGroup {
  constructor(protected sharedState: SharedState) {
    sharedState.anotherCreateUserRequest = { name: `${TEST_NAME_PREFIX}: ${chance.name()}` };
  }

  groupResponse: any;

  @when(/another valid user create request is made/, null, TIMEOUT)
  public async createAnotherUser() {
    const { anotherCreateUserRequest: request } = this.sharedState;
    const params = {
      url: `${URL}/users`,
      method: 'post',
      simple: false,
      body: JSON.stringify(request),
      headers: { 'SantaSwap-Test-Request': true }
    };
    this.sharedState.createAnotherUserResponse = JSON.parse(await post(params));
  }

  @when(/a valid join request is made/, null, TIMEOUT)
  public async joinGroup() {
    const { createAndJoinGroupResponse: group, createAnotherUserResponse: user } = this.sharedState;
    const params = {
      url: `${URL}/groups/${group.groupId}/users/${user.userId}`,
      method: 'post',
      simple: false
    };
    this.sharedState.joinGroupResponse = JSON.parse(await post(params));
  }

  @then(/the API response will include the basic group response/)
  public validateJoin() {
    const {
      createAndJoinGroupResponse: group,
      joinGroupResponse: response,
      anotherCreateUserRequest: user
    } = this.sharedState;

    expect(response.groupId).to.equal(group.groupId);
    expect(response.name).to.equal(group.name);
    expect(response.code).to.be.a('string');
    expect(response.members).to.have.members([user.name]);
    expect(response).to.have.all.keys(['groupId', 'name', 'code', 'members']);
  }
}
