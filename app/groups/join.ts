import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateProfileRequest, ProfileRecord } from './profile';
import { GroupRecord, BasicGroupResponse, GROUP_TYPE_PREFIX } from './group';
import { User } from './user';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const response = await joinGroup(path.groupId, body);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function joinGroup(groupId: string, user: User): Promise<BasicGroupResponse> {
  const group = await getGroup(groupId);
  const profileRequest = new CreateProfileRequest(group, user);
  const profile = await saveProfile(profileRequest);
  return new BasicGroupResponse(group, [profile]);
}

async function getGroup(code: string): Promise<GroupRecord> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    IndexName: process.env.GROUPS_TABLE_CODE_INDEX,
    KeyConditionExpression: '#code = :code',
    ExpressionAttributeNames: { '#code': 'code' },
    ExpressionAttributeValues: { ':code': code.toUpperCase() }
  };
  console.info('Getting group by code with params', params);
  const res = await groups.query(params).promise();
  return <GroupRecord>res.Items[0];
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
