import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateProfileRequest, ProfileRecord } from './profile';
import { GroupRecord, BasicGroupResponse, GROUP_TYPE_PREFIX } from './group';
import { UserRecord } from './user';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const users = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ path, success, error }: ApiSignature) => {
  try {
    const response = await joinGroup(path.groupId, path.userId);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function joinGroup(groupId: string, userId: string): Promise<BasicGroupResponse> {
  const user = await getUser(userId);
  const group = await getGroup(groupId);
  const profileRequest = new CreateProfileRequest(group, user);
  const profile = await saveProfile(profileRequest);
  return new BasicGroupResponse(group, [profile]);
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

async function getGroup(groupId: string): Promise<GroupRecord> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: { groupId, type: `${GROUP_TYPE_PREFIX}` }
  };
  console.info('Getting group by groupId with params', params);
  const res = await groups.get(params).promise();
  return <GroupRecord>res.Item;
}

async function saveProfile(profile: CreateProfileRequest): Promise<ProfileRecord> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: profile
  };
  console.log('Creating new profile with params', params);
  await groups.put(params).promise();
  return new ProfileRecord(profile);
}
