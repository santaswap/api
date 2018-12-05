import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { Group } from './group';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ event, success, error }: ApiSignature) => {
  try {
    const groupToSave = new Group('new group');
    const group = await save(groupToSave);
    success(group);
  } catch (err) {
    error(err);
  }
});

function save(group: Group) {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: group
  };
  console.log('Creating new group with params', params);
  return groups
    .put(params)
    .promise()
    .then(res => group);
}
