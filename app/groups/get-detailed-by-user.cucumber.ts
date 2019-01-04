import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { get } from 'request-promise';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const URL = getDeployedUrl();
const TIMEOUT = 10000;

@binding([SharedState])
export class CreateAndJoinGroup {
  constructor(protected sharedState: SharedState) {}

  groupResponse: any;

  @when(/a valid get detailed by user request is made/, null, TIMEOUT)
  public async getAllGroups() {
    const params = {
      url: `${URL}/users/${this.sharedState.userId}/groups/${this.sharedState.groupId}`,
      method: 'get',
      simple: false,
      headers: { 'SantaSwap-Test-Request': true }
    };
    const groupResponse = JSON.parse(await get(params));
    this.groupResponse = groupResponse;
  }

  @then(/the API response will include the detailed group response/)
  public validateCreateAndJoin() {
    // Validate group details
    expect(this.groupResponse.groupId).to.equal(this.sharedState.groupId);
    expect(this.groupResponse.name).to.equal(this.sharedState.groupRequest.name);
    expect(this.groupResponse.code).to.be.a('string');
    expect(this.groupResponse).to.have.all.keys('groupId', 'name', 'code', 'members', 'profile');

    // Validate profile details
    const profile = this.groupResponse.profile;
    expect(profile.userId).to.equal(this.sharedState.userId);
    expect(profile.name).to.equal(this.sharedState.userRequest.name);
    expect(profile.excludedUserIds).to.be.an('array');
    expect(profile).to.have.all.keys(['userId', 'giftIdeas', 'address', 'name', 'excludedUserIds']);

    // Validate member details
    expect(this.groupResponse.members).to.be.an('array');
    expect(this.groupResponse.members.length).to.equal(1);
    const member = this.groupResponse.members[0];
    expect(member.userId).to.equal(this.sharedState.anotherUserId);
    expect(member.name).to.equal(this.sharedState.anotherUserRequest.name);
  }
}
