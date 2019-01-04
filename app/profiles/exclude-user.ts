import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { ProfileRecord, DetailedProfileResponse, PROFILE_TYPE_PREFIX } from '../groups/profile';
import { CreateExclusionRequest, EXCLUSION_TYPE_PREFIX } from './exclusion';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ path, testRequest, success, error }: ApiSignature) => {
  try {
    await excludeUser(path.groupId, path.userId, path.excludedUserId, testRequest);
    const profile = await getProfile(path.groupId, path.userId);
    success(profile);
  } catch (err) {
    error(err);
  }
});

async function excludeUser(groupId: string, userId: string, excludedUserId: string, testRequest: boolean) {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: new CreateExclusionRequest(groupId, userId, excludedUserId, testRequest)
  };
  console.log('Excluding user with params', params);
  await groups.put(params).promise();
}

async function getProfile(groupId: string, userId: string): Promise<DetailedProfileResponse> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    KeyConditionExpression: '#groupId = :groupId and begins_with(#type, :type)',
    ExpressionAttributeNames: { '#groupId': 'groupId', '#type': 'type' },
    ExpressionAttributeValues: { ':groupId': `${groupId}`, ':type': `${PROFILE_TYPE_PREFIX}${userId}` }
  };
  console.log('Getting group detail and members with params', params);
  const items = await groups
    .query(params)
    .promise()
    .then(res => res.Items);
  const profileRecord = items.find(item => item.type === `${PROFILE_TYPE_PREFIX}${userId}`);
  const exclusions = items.filter(
    item => item.type.indexOf(`${PROFILE_TYPE_PREFIX}${userId}${EXCLUSION_TYPE_PREFIX}`) > -1
  );
  return new ProfileRecord(profileRecord, exclusions).getDetailedProfileResponse();
}
