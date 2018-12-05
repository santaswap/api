import { DynamoDB } from 'aws-sdk';
import { User } from './user';

const users = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export function saveUser(user: User) {
  const params = {
    TableName: process.env.USERS_TABLE,
    Item: user
  };
  console.log('Creating new user with params', params);
  return users
    .put(params)
    .promise()
    .then(res => user);
}

export function getUser(userId: string): Promise<User> {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: { userId }
  };
  console.log('Getting user with params', params);
  return users
    .get(params)
    .promise()
    .then(res => <User>res.Item);
}
