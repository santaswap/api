import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { ProfileResponse } from './profile-response';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const response = await excludeUser(path.groupId, path.userId, path.excludedUserId);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function excludeUser(groupId: string, userId: string, excludedUserId: string): Promise<ProfileResponse> {
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
    .then(res => res.Attributes)
    .then(user => {
      user.excludedUserIds = user.excludedUserIds ? user.excludedUserIds.values : [];
      return <ProfileResponse>user;
    });
}
