import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { post } from 'request-promise';
import { Chance } from 'chance';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const chance = new Chance();
const URL = getDeployedUrl();
const TEST_NAME_PREFIX = 'TEST_GROUP';
const TIMEOUT = 10000;

@binding([SharedState])
export class CreateAndJoinGroup {
  constructor(protected sharedState: SharedState) {
    sharedState.createAndJoinGroupRequest = { name: `${TEST_NAME_PREFIX}: ${chance.last()} family` };
  }

  @when(/a valid create and join request is made/, null, TIMEOUT)
  public async createAndJoinGroup() {
    const { createUserResponse: user, createAndJoinGroupRequest: request } = this.sharedState;
    const params = {
      url: `${URL}/users/${user.userId}/groups`,
      method: 'post',
      simple: false,
      body: JSON.stringify(request),
      headers: { 'SantaSwap-Test-Request': true }
    };
    this.sharedState.createAndJoinGroupResponse = JSON.parse(await post(params));
  }

  @then(/the API response will include the new group/)
  public validateCreateAndJoin() {
    const {
      createAndJoinGroupRequest: request,
      createAndJoinGroupResponse: response,
      createUserResponse: user
    } = this.sharedState;

    // Make sure the id matches uuid pattern
    expect(response.groupId).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(response.name).to.equal(request.name);
    expect(response.code).to.be.a('string');
    expect(response.members).to.have.members([user.name]);
    expect(response).to.have.all.keys('groupId', 'name', 'code', 'members');
  }
}
