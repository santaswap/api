import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { put } from 'request-promise';
import { Chance } from 'chance';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const chance = new Chance();
const URL = getDeployedUrl();
const TEST_NAME_PREFIX = 'TEST_USER';
const TIMEOUT = 10000;

@binding([SharedState])
export class UpdateProfile {
  constructor(protected sharedState: SharedState) {
    sharedState.updateProfileRequest = {
      name: `${TEST_NAME_PREFIX}: ${chance.name()}`,
      address: chance.address(),
      giftIdeas: chance.paragraph()
    };
  }

  @when(/a valid update profile request is made/, null, TIMEOUT)
  public async update() {
    const {
      updateProfileRequest: request,
      createAndJoinGroupResponse: group,
      createUserResponse: user
    } = this.sharedState;
    const params = {
      url: `${URL}/groups/${group.groupId}/users/${user.userId}`,
      method: 'post',
      simple: false,
      body: JSON.stringify(request),
      headers: { 'SantaSwap-Test-Request': true }
    };
    this.sharedState.updateProfileResponse = JSON.parse(await put(params));
  }

  @then(/the API response will include the updated profile information/)
  public validateUpdate() {
    const {
      updateProfileResponse: response,
      updateProfileRequest: request,
      createUserResponse: user,
      createAnotherUserResponse: anotherUser
    } = this.sharedState;
    expect(response.userId).to.equal(user.userId);
    expect(response.name).to.equal(request.name);
    expect(response.giftIdeas).to.equal(request.giftIdeas);
    expect(response.address).to.equal(request.address);
    expect(response.excludedUserIds).to.be.an('array');
    expect(response).to.have.all.keys('userId', 'name', 'address', 'giftIdeas', 'excludedUserIds');
  }
}
