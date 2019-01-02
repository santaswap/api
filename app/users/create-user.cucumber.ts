import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { post } from 'request-promise';
import { Chance } from 'chance';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const chance = new Chance();
const URL = getDeployedUrl();
const TEST_NAME_PREFIX = 'TEST_USER';

@binding([SharedState])
export class CreateUser {
  constructor(protected sharedState: SharedState) {}

  userRequest = { name: `${TEST_NAME_PREFIX}: ${chance.name()}` };
  userResponse: any;

  @when(/a valid user create request is made/)
  public async createUser() {
    const params = {
      url: `${URL}/users`,
      method: 'post',
      simple: false,
      body: JSON.stringify(this.userRequest)
    };
    const userResponse = JSON.parse(await post(params));
    this.userResponse = userResponse;
    this.sharedState.userId = userResponse.userId;
  }

  @then(/the API response will include the new user/)
  public validateUser() {
    expect(this.userResponse).to.not.equal(undefined);
    expect(this.userResponse.userId).to.not.equal(undefined);
    expect(this.userResponse.name).to.equal(this.userRequest.name);
  }
}
