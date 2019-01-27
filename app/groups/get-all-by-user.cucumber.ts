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
    const { user } = this.sharedState;
    const params = {
      url: `${URL}/users/${user.userId}/groups`,
      method: 'get',
      simple: false,
      headers: { 'SantaSwap-Test-Request': true }
    };
    this.sharedState.getAllGroupsResponse = JSON.parse(await get(params));
  }

  @then(/the API response will include basic group responses/)
  public validateCreateAndJoin() {
    const { getAllGroupsResponse: response, createAndJoinGroupResponse: group, user } = this.sharedState;

    expect(response.length).to.equal(1);
    const responseGroup = response[0];
    expect(responseGroup.groupId).to.equal(group.groupId);
    expect(responseGroup.name).to.equal(group.name);
    expect(responseGroup.code).to.equal(group.code);
    expect(responseGroup.members).to.have.members([user.name]);
    expect(responseGroup).to.have.all.keys('groupId', 'name', 'code', 'members', 'matched');
  }
}
