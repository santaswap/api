import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateProfileRequest } from './create-profile-request';
import { GroupRecord } from './group-record';
import { UserRecord } from './user-record';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const users = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const response = await joinGroup(path.groupId, path.userId);
    success(response);
  } catch (err) {
    error(err);
  }
});

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

async function joinGroup(groupId: string, userId: string): Promise<any> {
  const user = await getUser(userId);
  const group = await getGroup(groupId);
  const userProfile = new CreateProfileRequest(group, user);
  await saveProfile(userProfile);
  return { group, user, userProfile };
}

async function getGroup(groupId: string): Promise<GroupRecord> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: { groupId, type: `GROUP:${groupId}` }
  };
  console.info('Getting group by groupId with params', params);
  const res = await groups.get(params).promise();
  return <GroupRecord>res.Item;
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
