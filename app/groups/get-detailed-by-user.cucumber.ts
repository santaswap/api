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
    expect(this.groupResponse).to.not.equal(undefined);
    expect(this.groupResponse.groupId).to.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  }
}
