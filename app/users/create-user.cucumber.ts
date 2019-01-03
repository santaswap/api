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
export class CreateUser {
  constructor(protected sharedState: SharedState) {}

  userRequest = { name: `${TEST_NAME_PREFIX}: ${chance.name()}` };
  userResponse: any;

  @when(/a valid user create request is made/, null, TIMEOUT)
  public async createUser() {
    const params = {
      url: `${URL}/users`,
      method: 'post',
      simple: false,
      body: JSON.stringify(this.userRequest),
      headers: { 'SantaSwap-Test-Request': true }
    };
    const userResponse = JSON.parse(await post(params));
    this.userResponse = userResponse;
    this.sharedState.userRequest = this.userRequest;
    this.sharedState.userResponse = userResponse;
    this.sharedState.userId = userResponse.userId;
  }

  @then(/the API response will include the new user/)
  public validateUser() {
    // Make sure the id matches uuid pattern
    expect(this.userResponse.userId).to.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(this.userResponse.name).to.equal(this.userRequest.name);
    expect(this.userResponse).to.have.all.keys('userId', 'name');
  }
}
