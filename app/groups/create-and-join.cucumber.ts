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
  constructor(protected sharedState: SharedState) {}

  groupRequest = { name: `${TEST_NAME_PREFIX}: ${chance.last()} family` };
  groupResponse: any;

  @when(/a valid create and join request is made/, null, TIMEOUT)
  public async createAndJoinGroup() {
    const params = {
      url: `${URL}/users/${this.sharedState.userId}/groups`,
      method: 'post',
      simple: false,
      body: JSON.stringify(this.groupRequest),
      headers: { 'SantaSwap-Test-Request': true }
    };
    const groupResponse = JSON.parse(await post(params));
    this.groupResponse = groupResponse;
    this.sharedState.groupId = groupResponse.groupId;
    this.sharedState.groupRequest = this.groupRequest;
    this.sharedState.groupResponse = groupResponse;
  }

  @then(/the API response will include the new group/)
  public validateCreateAndJoin() {
    // Make sure the id matches uuid pattern
    expect(this.groupResponse.groupId).to.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(this.groupResponse.name).to.equal(this.groupRequest.name);
    expect(this.groupResponse.code).to.be.a('string');
    expect(this.groupResponse.members).to.have.members([this.sharedState.userRequest.name]);
    expect(this.groupResponse).to.have.all.keys('groupId', 'name', 'code', 'members');
  }
}
