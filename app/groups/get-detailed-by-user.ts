import { DynamoDB } from 'aws-sdk';
import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { GroupRecord, DetailedGroupResponse } from './group';
import { ProfileResponse } from './profile';

const groups = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const handler = apiWrapper(async ({ path, success, error }: ApiSignature) => {
  try {
    const response = await getDetailedGroupByUser(path.userId, path.groupId);
    success(response);
  } catch (err) {
    error(err);
  }
});

async function getDetailedGroupByUser(userId: string, groupId: string): Promise<any> {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    KeyConditionExpression: '#groupId = :groupId',
    ExpressionAttributeNames: { '#groupId': 'groupId' },
    ExpressionAttributeValues: { ':groupId': `${groupId}` }
  };
  console.log('Getting group detail and members with params', params);
  let group: GroupRecord;
  let members: ProfileResponse[] = [];
  let userProfile: ProfileResponse;
  return groups
    .query(params)
    .promise()
    .then(res => res.Items)
    .then(items => {
      group = <GroupRecord>items.find(item => item.type.indexOf('GROUP') > -1);
      delete group.type;
      items
        .filter(item => item.type && item.type.indexOf('USER') > -1)
        .forEach(user => {
          console.log('Seeing if user profile is of user or member', user);
          delete user.groupId;
          user.userId = user.type.split('USER:')[1];
          delete user.type;
          if (user.userId !== `${userId}`) {
            delete user.excludedUserIds;
            console.log('Found a member', user);
            members.push(<ProfileResponse>user);
          } else {
            user.excludedUserIds = user.excludedUserIds ? user.excludedUserIds.values : [];
            console.log('Found the user', user);
            userProfile = <ProfileResponse>user;
          }
        });
    })
    .then(() => new DetailedGroupResponse(group, members, userProfile));
}
