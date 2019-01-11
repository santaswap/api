import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { get } from 'request-promise';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const URL = getDeployedUrl();
const TIMEOUT = 10000;

@binding([SharedState])
export class GetDetailedGroup {
  constructor(protected sharedState: SharedState) {}

  groupResponse: any;

  @when(/a valid get detailed by user request is made/, null, TIMEOUT)
  public async getDetailedGroup() {
    const { createUserResponse: user, createAndJoinGroupResponse: group } = this.sharedState;
    const params = {
      url: `${URL}/users/${user.userId}/groups/${group.groupId}`,
      method: 'get',
      simple: false,
      headers: { 'SantaSwap-Test-Request': true }
    };
    this.sharedState.getDetailedGroupResponse = JSON.parse(await get(params));
  }

  @then(/the API response will include the detailed group response/)
  public validateGetDetailedGroup() {
    const {
      getDetailedGroupResponse: response,
      createUserResponse: user,
      createAndJoinGroupResponse: group,
      createAnotherUserResponse: anotherUser
    } = this.sharedState;
    // Validate group details
    expect(response.groupId).to.equal(group.groupId);
    expect(response.name).to.equal(group.name);
    expect(response.code).to.be.a('string');
    expect(response).to.have.all.keys('groupId', 'name', 'code', 'members', 'profile', 'matched');

    // Validate profile details
    const profile = response.profile;
    expect(profile.userId).to.equal(user.userId);
    expect(profile.name).to.equal(user.name);
    expect(profile.excludedUserIds).to.be.an('array');
    expect(profile).to.have.all.keys(['userId', 'giftIdeas', 'address', 'name', 'excludedUserIds']);

    // Validate member details

    expect(response.members).to.be.an('array');
    expect(response.members.length).to.equal(1);
    const member = response.members[0];
    expect(member.userId).to.equal(anotherUser.userId);
    expect(member.name).to.equal(anotherUser.name);
  }
}
