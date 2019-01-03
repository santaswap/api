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
export class UpdateProfile {
  constructor(protected sharedState: SharedState) {}

  profileRequest = {
    name: `${TEST_NAME_PREFIX}: ${chance.name()}`,
    address: chance.address(),
    giftIdeas: chance.paragraph()
  };
  profileResponse: any;

  @when(/a valid update profile request is made/, null, TIMEOUT)
  public async update() {
    const params = {
      url: `${URL}/groups/${this.sharedState.groupId}/users/${this.sharedState.userId}/profile`,
      method: 'post',
      simple: false,
      body: JSON.stringify(this.profileRequest),
      headers: { 'SantaSwap-Test-Request': true }
    };
    const profileResponse = JSON.parse(await post(params));
    this.profileResponse = profileResponse;
  }

  @then(/the API response will include the updated profile information/)
  public validateUpdate() {
    expect(this.profileResponse).to.not.equal(undefined);
    expect(this.profileResponse.name).to.equal(this.profileRequest.name);
    expect(this.profileResponse.giftIdeas).to.equal(this.profileRequest.giftIdeas);
    expect(this.profileResponse.address).to.equal(this.profileRequest.address);
  }
}
