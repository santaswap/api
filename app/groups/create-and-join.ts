import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateGroupRequest, BasicGroupResponse, GroupRecord } from './group';
import { CreateProfileRequest, ProfileRecord } from './profile';
import { UserRecord } from './user';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const users = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ body, testRequest, success, error }: ApiSignature) => {
  try {
    const response = await createAndJoinGroup(body, testRequest);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function createAndJoinGroup(body: any, testRequest: boolean): Promise<any> {
  const createGroupRequest = new CreateGroupRequest(body, testRequest);
  const group = await saveGroup(createGroupRequest);
  const createProfileRequest = new CreateProfileRequest(group, body.user);
  const profile = await saveProfile(createProfileRequest);
  return new BasicGroupResponse(group, [profile]);
}

async function saveGroup(group: CreateGroupRequest): Promise<GroupRecord> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: group
  };
  console.log('Creating new group with params', params);
  await groups.put(params).promise();
  return <GroupRecord>group;
}

async function saveProfile(profile: CreateProfileRequest): Promise<ProfileRecord> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: profile
  };
  console.log('Creating new profile with params', params);
  await groups.put(params).promise();
  return new ProfileRecord({ record: profile });
}
