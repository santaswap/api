import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { ProfileResponse, ProfileRecord, PROFILE_TYPE_PREFIX } from './profile';
import { BasicGroupResponse, GroupRecord, GROUP_TYPE_PREFIX } from './group';

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

export function getProfiles(userId: string): Promise<ProfileResponse[]> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    IndexName: process.env.GROUPS_TABLE_TYPE_INDEX,
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: { '#type': 'type' },
    ExpressionAttributeValues: { ':type': `${PROFILE_TYPE_PREFIX}${userId}` }
  };
  console.log('Getting all profiles by user with params', params);
  return groups
    .query(params)
    .promise()
    .then(res => res.Items)
    .then(items =>
      items.map(item => {
        item.excludedUserIds = item.excludedUserIds ? item.excludedUserIds.values : [];
        return <ProfileResponse>item;
      })
    );
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
    .filter(item => item.type && item.type.indexOf(PROFILE_TYPE_PREFIX) > -1)
    .map(item => new ProfileRecord(item));
  return new BasicGroupResponse(group, profiles);
}
