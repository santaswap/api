import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { User } from './user';

const users = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const { name } = body;
    const userToSave = new User(name);
    const user = await save(userToSave);
    success(user);
  } catch (err) {
    error(err);
  }
});

function save(user: User) {
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
