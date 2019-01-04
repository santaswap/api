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
  constructor(protected sharedState: SharedState) {
    this.sharedState.createUserRequest = { name: `${TEST_NAME_PREFIX}: ${chance.name()}` };
  }

  @when(/a valid user create request is made/, null, TIMEOUT)
  public async createUser() {
    const { createUserRequest } = this.sharedState;
    const params = {
      url: `${URL}/users`,
      method: 'post',
      simple: false,
      body: JSON.stringify(createUserRequest),
      headers: { 'SantaSwap-Test-Request': true }
    };
    this.sharedState.createUserResponse = JSON.parse(await post(params));
  }

  @then(/the API response will include the new user/)
  public validateUser() {
    const { createUserResponse: response, createUserRequest: request } = this.sharedState;
    // Make sure the id matches uuid pattern
    expect(response.userId).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(response.name).to.equal(request.name);
    expect(response).to.have.all.keys('userId', 'name');
  }
}
