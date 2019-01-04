import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { UpdateProfileRequest } from './update-profile-request';
import { DetailedProfileResponse, PROFILE_TYPE_PREFIX, ProfileRecord } from '../groups/profile';
import { EXCLUSION_TYPE_PREFIX } from './exclusion';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const { groupId, userId } = path;
    const { name, address, giftIdeas } = body;
    const updateUserProfileRequest = new UpdateProfileRequest({ groupId, userId, name, address, giftIdeas });
    await updateProfile(updateUserProfileRequest);
    const response = await getProfile(groupId, userId);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function updateProfile(request: UpdateProfileRequest) {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: { groupId: request.groupId, type: request.type },
    UpdateExpression: 'SET #name = :name, #address = :address, #giftIdeas = :giftIdeas',
    ExpressionAttributeNames: { '#name': 'name', '#address': 'address', '#giftIdeas': 'giftIdeas' },
    ExpressionAttributeValues: { ':name': request.name, ':address': request.address, ':giftIdeas': request.giftIdeas }
  };
  console.log('Updating profile with params', params);
  const res = await groups.update(params).promise();
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
