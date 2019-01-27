import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { post } from 'request-promise';
import { Chance } from 'chance';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const chance = new Chance();
const URL = getDeployedUrl();
const TIMEOUT = 10000;

@binding([SharedState])
export class JoinGroup {
  constructor(protected sharedState: SharedState) {}
  groupResponse: any;

  @when(/a valid join request is made/, null, TIMEOUT)
  public async joinGroup() {
    const { createAndJoinGroupResponse: group, anotherUser: user } = this.sharedState;
    const params = {
      url: `${URL}/groups/${group.code}/users/${user.userId}`,
      method: 'post',
      simple: false,
      body: JSON.stringify(user),
      headers: { 'SantaSwap-Test-Request': true, 'Content-Type': 'application/json' }
    };
    this.sharedState.joinGroupResponse = JSON.parse(await post(params));
    this.sharedState.joinGroupRequest = user;
  }

  @then(/the API response will include the basic group response/)
  public validateJoin() {
    const { createAndJoinGroupResponse: group, joinGroupResponse: response, anotherUser: user } = this.sharedState;

    expect(response.groupId).to.equal(group.groupId);
    expect(response.name).to.equal(group.name);
    expect(response.code).to.be.a('string');
    expect(response.members).to.have.members([user.name]);
    expect(response).to.have.all.keys(['groupId', 'name', 'code', 'members', 'matched']);
  }
}
