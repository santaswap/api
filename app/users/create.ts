import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateUserRequest } from './create-user-request';

const users = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const { name } = body;
    const userToSave = new CreateUserRequest(name);
    const user = await saveUser(userToSave);
    success(user);
  } catch (err) {
    error(err);
  }
});

async function saveUser(user: CreateUserRequest): Promise<CreateUserRequest> {
  const params = {
    TableName: process.env.USERS_TABLE,
    Item: user
  };
  console.log('Creating new user with params', params);
  await users.put(params).promise();
  return user;
}
