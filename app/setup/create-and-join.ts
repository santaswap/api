import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateGroupRequest } from './create-group-request';
import { CreateProfileRequest } from './create-profile-request';
import { UserRecord } from './user-record';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const users = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const group = new CreateGroupRequest(body);
    const response = await createAndJoinGroup(group, path.userId);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function createAndJoinGroup(group: CreateGroupRequest, userId: string): Promise<any> {
  await saveGroup(group);
  const user = await getUser(userId);
  const userProfile = new CreateProfileRequest(group, user);
  await saveProfile(userProfile);
  return { group, user, userProfile };
}

async function saveGroup(group: CreateGroupRequest): Promise<CreateGroupRequest> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: group
  };
  console.log('Creating new group with params', params);
  await groups.put(params).promise();
  return group;
}

function getUser(userId: string): Promise<UserRecord> {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: { userId }
  };
  console.log('Getting user with params', params);
  return users
    .get(params)
    .promise()
    .then(res => <UserRecord>res.Item);
}

async function saveProfile(userProfile: CreateProfileRequest): Promise<CreateProfileRequest> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: userProfile
  };
  console.log('Creating new user profile with params', params);
  await groups.put(params).promise();
  return userProfile;
}
