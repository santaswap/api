import { DynamoDB } from 'aws-sdk';
import { Group } from './group';
import { UserProfile } from './user-profile';
import { getUser } from '../users';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const converter = DynamoDB.Converter;

export async function createAndJoinGroup(group: Group, userId: string): Promise<any> {
  await saveGroup(group);
  const user = await getUser(userId);
  const userProfile = new UserProfile(group, user);
  await saveUserProfile(userProfile);
  return { group, user, userProfile };
}

export async function joinGroup(groupId: string, userId: string): Promise<any> {
  const user = await getUser(userId);
  const group = await getGroup(groupId);
  const userProfile = new UserProfile(group, user);
  await saveUserProfile(userProfile);
  return { group, user, userProfile };
}

export async function getGroupsByUser(userId: string): Promise<any> {
  const userProfiles = await getUserProfiles(userId);
  console.log('Found user profiles', userProfiles);
  const [...groups] = await Promise.all(userProfiles.map(up => getGroupAndMembers(up.groupId)));
  console.log('Found groups', groups);
  return { groups };
}

export async function excludeUser(groupId: string, userId: string, excludedUserId: string): Promise<any> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: { groupId, type: `USER:${userId}` },
    UpdateExpression: 'ADD #excludedUserIds :excludedUserId',
    ExpressionAttributeNames: { '#excludedUserIds': 'excludedUserIds' },
    ExpressionAttributeValues: { ':excludedUserId': groups.createSet([excludedUserId]) },
    ReturnValues: 'ALL_NEW'
  };
  console.log('Excluding user with params', params);
  return groups
    .update(params)
    .promise()
    .then(res => res.Attributes);
}

function getGroup(groupId: string): Promise<Group> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: { groupId, type: `GROUP:${groupId}` }
  };
  console.info('Getting group by groupId with params', params);
  return groups
    .get(params)
    .promise()
    .then(res => <Group>res.Item);
}

function getGroupAndMembers(groupId: string): Promise<any> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: { '#groupId': 'groupId' },
    ExpressionAttributeValues: { ':groupId': `${groupId}` }
  };
  console.log('Getting group and members with params', params);
  let group;
  return groups
    .query(params)
    .promise()
    .then(res => res.Items)
    .then(items => {
      group = items.find(item => item.type.indexOf('GROUP') > -1);
      group.members = [];
      items.filter(item => item.type.indexOf('USER') > -1).forEach(user => group.members.push(user));
    })
    .then(() => group);
}

function getGroups(userProfiles: UserProfile[]): Promise<Group[]> {
  const RequestItems = {};
  const Keys = userProfiles.map(up => {
    return { groupId: up.groupId, type: `GROUP:${up.groupId}` };
  });
  RequestItems[process.env.GROUPS_TABLE] = { Keys };
  const params = { RequestItems };
  console.log('Getting all user profiles by user with params', JSON.stringify(params));
  return groups
    .batchGet(params)
    .promise()
    .then(res => <Group[]>res.Responses[process.env.GROUPS_TABLE]);
}

function getUserProfiles(userId: string): Promise<UserProfile[]> {
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
    .then(res => <UserProfile[]>res.Items);
}

function saveGroup(group: Group): Promise<Group> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: group
  };
  console.log('Creating new group with params', params);
  return groups
    .put(params)
    .promise()
    .then(res => group);
}

function saveUserProfile(userProfile: UserProfile): Promise<UserProfile> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: userProfile
  };
  console.log('Creating new user profile with params', params);
  return groups
    .put(params)
    .promise()
    .then(res => userProfile);
}

function getUserProfile(groupId: string, userId: string): Promise<UserProfile> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: { groupId, userId }
  };
  console.log('Getting user profile with params', params);
  return groups
    .get(params)
    .promise()
    .then(res => <UserProfile>res.Item);
}
