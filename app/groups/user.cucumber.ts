import { binding, given, when, then, after } from 'cucumber-tsflow';
import { Chance } from 'chance';
import { SharedState } from '@manwaring/serverless-test-helper';

const chance = new Chance();
const TEST_NAME_PREFIX = 'TEST_USER';
const TIMEOUT = 10000;

@binding([SharedState])
export class CreateUser {
  constructor(protected sharedState: SharedState) {
    this.sharedState.createUserRequest = { name: `${TEST_NAME_PREFIX}: ${chance.name()}` };
  }

  @when(/a valid user exists/, null, TIMEOUT)
  public async setupUser() {
    this.sharedState.user = {
      userId: `google-oauth2-${chance.integer({ min: 10000000000000000, max: 999999999999999999999 })}`,
      name: chance.name(),
      email: chance.email()
    };
  }

  @when(/another valid user exists/, null, TIMEOUT)
  public async setupAnotherUser() {
    this.sharedState.anotherUser = {
      userId: `twitter-${chance.integer({ min: 10000000, max: 99999999999999999 })}`,
      name: chance.name(),
      email: chance.email()
    };
  }
}
