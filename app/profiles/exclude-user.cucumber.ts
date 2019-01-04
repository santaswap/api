import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { post } from 'request-promise';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const URL = getDeployedUrl();
const TIMEOUT = 10000;

@binding([SharedState])
export class ExcludeUser {
  constructor(protected sharedState: SharedState) {}

  exclusionResponse: any;

  @when(/a valid exclude user request is made/, null, TIMEOUT)
  public async exclude() {
    const {
      createAndJoinGroupResponse: group,
      createUserResponse: user,
      createAnotherUserResponse: anotherUser
    } = this.sharedState;
    const params = {
      url: `${URL}/groups/${group.groupId}/users/${user.userId}/excludedUsers/${anotherUser.userId}`,
      method: 'post',
      simple: false,
      headers: { 'SantaSwap-Test-Request': true }
    };
    this.sharedState.excludeUserResponse = JSON.parse(await post(params));
  }

  @then(/the API response will include the exclusion/)
  public validateExclusion() {
    const {
      excludeUserResponse: response,
      createAndJoinGroupResponse: group,
      createUserResponse: user,
      createAnotherUserResponse: anotherUser
    } = this.sharedState;
    expect(response.userId).to.equal(user.userId);
    expect(response.name).to.equal(user.name);
    expect(response.address).to.be.a('string');
    expect(response.giftIdeas).to.be.a('string');
    expect(response.excludedUserIds).to.contain(anotherUser.userId);
    expect(response).to.have.all.keys('userId', 'name', 'address', 'giftIdeas', 'excludedUserIds');
  }
}
