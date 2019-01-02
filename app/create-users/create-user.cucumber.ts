import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { post } from 'request-promise';
import { getDeployedUrl } from '@manwaring/serverless-test-helper';

const URL = getDeployedUrl();

@binding()
export class CreateUser {
  userRequest = { name: 'This is my name' };
  userResponse: any;

  @when(/a valid user create request is made/)
  public async createUser() {
    const params = {
      url: `${URL}/users`,
      method: 'post',
      simple: false,
      body: JSON.stringify(this.userRequest)
    };
    this.userResponse = JSON.parse(await post(params));
  }

  @then(/the API response will include the new user/)
  public validateUser() {
    expect(this.userResponse).to.not.equal(undefined);
    expect(this.userResponse.userId).to.not.equal(undefined);
    expect(this.userResponse.name).to.equal(this.userRequest.name);
  }
}
