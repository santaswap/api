import { ExclusionRecord } from './../profiles/exclusion';
import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { GroupRecord, GROUP_TYPE_PREFIX, DetailedGroupResponse } from './group';
import { ProfileRecord, PROFILE_TYPE_PREFIX, DetailedProfileResponse, UpdateProfileMatchRequest } from './profile';
import { EXCLUSION_TYPE_PREFIX } from '../profiles/exclusion';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ path, success, error }: ApiSignature) => {
  try {
    const response = await matchGroup(path.groupId);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function matchGroup(groupId: string): Promise<any> {
  const profiles = await getProfiles(groupId);
  const targets = [...profiles];
  const updateProfileRequests = profiles.map(profile => {
    let profileToRemove;
    const recipient = targets.find((target, index) => {
      profileToRemove = index;
      return target.userId !== profile.userId;
    });
    targets.splice(profileToRemove, 1);
    return new UpdateProfileMatchRequest({ groupId, userId: profile.userId, recipientUserId: recipient.userId });
  });
  await Promise.all(updateProfileRequests.map(request => updateProfile(request)));
}

async function getProfiles(groupId: string): Promise<DetailedProfileResponse[]> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: { '#groupId': 'groupId' },
    ExpressionAttributeValues: { ':groupId': `${groupId}` }
  };
  console.log('Getting group detail and members with params', params);
  const items = await groups
    .query(params)
    .promise()
    .then(res => res.Items);
  const profiles = items
    .filter(item => item.type.indexOf(PROFILE_TYPE_PREFIX) > -1 && item.type.indexOf(EXCLUSION_TYPE_PREFIX) < 0)
    .map(item => new ProfileRecord(item).getDetailedProfileResponse());
  // const exclusions = items
  //   .filter(item => item.type.indexOf(EXCLUSION_TYPE_PREFIX) > -1)
  //   .map(item => new ExclusionRecord(item));
  // TODO add exclusion records to profiles
  return profiles;
}

async function updateProfile(request: UpdateProfileMatchRequest): Promise<any> {
  // TODO add an updated at field which is always set
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: { groupId: request.groupId, type: request.type },
    UpdateExpression: 'SET #recipientUserId = :recipientUserId',
    ExpressionAttributeNames: { '#recipientUserId': 'recipientUserId' },
    ExpressionAttributeValues: { ':recipientUserId': request.recipientUserId }
  };
  console.log('Updating profile with params', params);
  await groups.update(params).promise();
}
