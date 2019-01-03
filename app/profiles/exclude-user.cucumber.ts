import { binding, given, when, then, after } from 'cucumber-tsflow';
import { expect } from 'chai';
import { post } from 'request-promise';
import { Chance } from 'chance';
import { getDeployedUrl, SharedState } from '@manwaring/serverless-test-helper';

const chance = new Chance();
const URL = getDeployedUrl();
const TEST_NAME_PREFIX = 'TEST_GROUP';

@binding([SharedState])
export class CreateAndJoinGroup {
  constructor(protected sharedState: SharedState) {}

  groupRequest = { name: `${TEST_NAME_PREFIX}: ${chance.last()} family` };
  groupResponse: any;

  // @when(/a valid create and join request is made/)
  // public async createAndJoinGroup() {
  //   const params = {
  //     url: `${URL}/users/${this.sharedState.userId}/groups`,
  //     method: 'post',
  //     simple: false,
  //     body: JSON.stringify(this.groupRequest)
  //   };
  //   const groupResponse = JSON.parse(await post(params));
  //   this.groupResponse = groupResponse;
  //   this.sharedState.groupId = groupResponse.groupId;
  // }

  // @then(/the API response will include the new group/)
  // public validateCreateAndJoin() {
  //   expect(this.groupResponse).to.not.equal(undefined);
  //   expect(this.groupResponse.groupId).to.match(
  //     /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  //   );
  //   expect(this.groupResponse.name).to.equal(this.groupRequest.name);
  // }
}
