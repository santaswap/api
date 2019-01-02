import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { ProfileResponse } from './profile';
import { BasicGroupResponse } from './group';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ path, success, error }: ApiSignature) => {
  try {
    const response = await getAllGroupsByUser(path.userId);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function getAllGroupsByUser(userId: string): Promise<any> {
  const userProfiles = await getProfiles(userId);
  console.log('Found user profiles', userProfiles);
  const [...groups] = await Promise.all(userProfiles.map(up => getGroupAndMembers(up.groupId)));
  console.log('Found groups', groups);
  return groups;
}

export function getProfiles(userId: string): Promise<ProfileResponse[]> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    IndexName: process.env.GROUPS_TABLE_TYPE_INDEX,
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: { '#type': 'type' },
    ExpressionAttributeValues: { ':type': `USER:${userId}` }
  };
  console.log('Getting all user profiles by user with params', params);
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

function getGroupAndMembers(groupId: string): Promise<any> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: { '#groupId': 'groupId' },
    ExpressionAttributeValues: { ':groupId': `${groupId}` }
  };
  console.log('Getting group and members with params', params);
  let group: BasicGroupResponse;
  return groups
    .query(params)
    .promise()
    .then(res => res.Items)
    .then(items => {
      group = <BasicGroupResponse>items.find(item => item.type.indexOf('GROUP') > -1);
      group.members = [];
      items
        .filter(item => item.type && item.type.indexOf('USER') > -1)
        .forEach(user => {
          group.members.push(user.name);
        });
    })
    .then(() => group);
}
