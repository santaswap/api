import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { get } from 'request-promise';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const URL = getDeployedUrl();
const TIMEOUT = 10000;

@binding([SharedState])
export class CreateAndJoinGroup {
  constructor(protected sharedState: SharedState) {}

  groupsResponse: any[];

  @when(/a valid get all groups by user request is made/, null, TIMEOUT)
  public async getAllGroups() {
    const params = {
      url: `${URL}/users/${this.sharedState.userId}/groups`,
      method: 'get',
      simple: false,
      headers: { 'SantaSwap-Test-Request': true }
    };
    const groupsResponse = JSON.parse(await get(params));
    this.groupsResponse = groupsResponse;
  }

  @then(/the API response will include basic group responses/)
  public validateCreateAndJoin() {
    expect(this.groupsResponse.length).to.equal(1);
    const group = this.groupsResponse[0];
    expect(group.groupId).to.equal(this.sharedState.groupId);
    expect(group.name).to.equal(this.sharedState.groupRequest.name);
    expect(group.code).to.equal(this.sharedState.groupResponse.code);
    expect(group.members).to.have.members([this.sharedState.userRequest.name]);
    expect(group).to.have.all.keys('groupId', 'name', 'code', 'members');
  }
}
