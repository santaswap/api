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
    const params = {
      url: `${URL}/groups/${this.sharedState.groupId}/users/${this.sharedState.userId}/excludedUsers/${
        this.sharedState.anotherUserId
      }`,
      method: 'post',
      simple: false,
      headers: { 'SantaSwap-Test-Request': true }
    };
    const exclusionResponse = JSON.parse(await post(params));
    this.exclusionResponse = exclusionResponse;
  }

  @then(/the API response will include the exclusion/)
  public validateExclusion() {
    expect(this.exclusionResponse).to.not.equal(undefined);
    expect(this.exclusionResponse.groupId).to.equal(this.sharedState.groupId);
    expect(this.exclusionResponse.excludedUserIds).to.contain(this.sharedState.anotherUserId);
    // TODO make sure user id matches
  }
}
