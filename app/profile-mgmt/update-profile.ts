import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { UpdateProfileRequest } from './update-profile-request';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const { groupId, userId } = path;
    const { name, address, giftIdeas } = body;
    const updateUserProfileRequest = new UpdateProfileRequest({ groupId, userId, name, address, giftIdeas });
    const response = await updateProfile(updateUserProfileRequest);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function updateProfile(userProfileUpdateRequest: UpdateProfileRequest): Promise<UpdateProfileRequest> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: userProfileUpdateRequest
  };
  console.log('Updating user profile with params', params);
  await groups.put(params).promise();
  return userProfileUpdateRequest;
}
