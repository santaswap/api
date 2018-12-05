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

export async function getGroupsByUser(userId: string) {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    KeyConditionExpression: '',
    ExpressionAttributeValues: {}
  };
  console.log('Getting all groups by user with params', params);
  return groups
    .query(params)
    .promise()
    .then(res => res.Items);
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
