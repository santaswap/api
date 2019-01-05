import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateUserRequest, UserResponse } from './user';

const users = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ body, testRequest, success, error }: ApiSignature) => {
  try {
    const userToSave = new CreateUserRequest(body, testRequest);
    const user = await saveUser(userToSave);
    success(user);
  } catch (err) {
    error(err);
  }
});

async function saveUser(user: CreateUserRequest): Promise<UserResponse> {
  const params = {
    TableName: process.env.USERS_TABLE,
    Item: user
  };
  console.log('Creating new user with params', params);
  await users.put(params).promise();
  return new UserResponse(user);
}
