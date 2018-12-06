import { DynamoDB } from 'aws-sdk';
import { Group } from './group';
import { UserProfile } from './user-profile';
import { getUser } from '../users';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export async function createAndJoinGroup(group: Group, userId: string) {
  await saveGroup(group);
  const user = await getUser(userId);
  const userProfile = new UserProfile(group, user);
  await saveUserProfile(userProfile);
  return { group, user, userProfile };
}

export async function joinGroup(groupId: string, userId: string) {
  const user = await getUser(userId);
  const group = await getGroup(groupId);
  const userProfile = new UserProfile(group, user);
  await saveUserProfile(userProfile);
  return { group, user, userProfile };
}

export async function getGroupsByUser(userId: string) {
  const userProfiles = await getUserProfiles(userId);
  console.log('Found user profiles', userProfiles);
  const groups = await getGroups(userProfiles);
  console.log('Found groups', groups);
  return { groups, userProfiles };
}

function getGroup(groupId: string): Promise<Group> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: { groupId, type: `GROUP:${groupId}` }
  };
  console.info('Getting group by groupId with params', params);
  return groups.get(params).promise().then(res => <Group>res.Item);
}

function getGroups(userProfiles: UserProfile[]): Promise<Group[]> {
  const RequestItems = {};
  const Keys = userProfiles.map(up => {
    return { groupId: up.groupId, type: `GROUP:${up.groupId}` }
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
