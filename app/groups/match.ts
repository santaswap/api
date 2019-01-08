import { ExclusionRecord } from './../profiles/exclusion';
import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { GroupRecord, GROUP_TYPE_PREFIX, DetailedGroupResponse } from './group';
import { ProfileRecord, PROFILE_TYPE_PREFIX } from './profile';
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
  const group = await getDetailedGroup(groupId);
}

async function getDetailedGroup(groupId: string): Promise<any> {
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
  const group = new GroupRecord(items.find(item => item.type.indexOf(GROUP_TYPE_PREFIX) > -1));
  const profiles = items
    .filter(item => item.type.indexOf(PROFILE_TYPE_PREFIX) > -1 && item.type.indexOf(EXCLUSION_TYPE_PREFIX) < 0)
    .map(item => new ProfileRecord(item).getBasicProfileResponse());
  const exclusions = items
    .filter(item => item.type.indexOf(EXCLUSION_TYPE_PREFIX) > -1)
    .map(item => new ExclusionRecord(item));
  // TODO add exclusion records to profiles
  return new DetailedGroupResponse(group, profiles, null);
}
