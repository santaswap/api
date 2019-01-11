import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { DetailedProfileResponse, ProfileRecord, PROFILE_TYPE_PREFIX } from './profile';
import { BasicGroupResponse, GroupRecord, GROUP_TYPE_PREFIX } from './group';
import { EXCLUSION_TYPE_PREFIX } from '../profiles/exclusion';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ path, success, error }: ApiSignature) => {
  try {
    const response = await getAllGroupsByUser(path.userId);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function getAllGroupsByUser(userId: string): Promise<BasicGroupResponse[]> {
  const profiles = await getProfiles(userId);
  console.log('Found profiles', profiles);
  const [...groups] = await Promise.all(profiles.map(profile => getGroupAndMembers(profile.groupId)));
  console.log('Found groups', groups);
  return groups;
}

export async function getProfiles(userId: string): Promise<ProfileRecord[]> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    IndexName: process.env.GROUPS_TABLE_TYPE_INDEX,
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: { '#type': 'type' },
    ExpressionAttributeValues: { ':type': `${PROFILE_TYPE_PREFIX}${userId}` }
  };
  console.log('Getting all profiles by user with params', params);
  const items = await groups
    .query(params)
    .promise()
    .then(res => res.Items);
  return items.map(record => new ProfileRecord({ record }));
}

async function getGroupAndMembers(groupId: string): Promise<BasicGroupResponse> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: { '#groupId': 'groupId' },
    ExpressionAttributeValues: { ':groupId': `${groupId}` }
  };
  console.log('Getting group and members with params', params);
  const items = await groups
    .query(params)
    .promise()
    .then(res => res.Items);
  const group = new GroupRecord(items.find(item => item.type.indexOf(GROUP_TYPE_PREFIX) > -1));
  const profiles = items
    .filter(
      item => item.type && item.type.indexOf(PROFILE_TYPE_PREFIX) > -1 && item.type.indexOf(EXCLUSION_TYPE_PREFIX) < 0
    )
    .map(record => new ProfileRecord({ record }));
  return new BasicGroupResponse(group, profiles);
}
