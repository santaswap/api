import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateGroupRequest, BasicGroupResponse, GroupRecord } from './group';
import { CreateProfileRequest, ProfileRecord } from './profile';
import { UserRecord } from './user';

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

async function createAndJoinGroup(createGroupRequest: CreateGroupRequest, userId: string): Promise<any> {
  const group = await saveGroup(createGroupRequest);
  const user = await getUser(userId);
  const createProfileRequest = new CreateProfileRequest(group, user);
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

async function saveProfile(userProfile: CreateProfileRequest): Promise<ProfileRecord> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: userProfile
  };
  console.log('Creating new user profile with params', params);
  await groups.put(params).promise();
  return <ProfileRecord>userProfile;
}
