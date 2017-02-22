'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const helper = require('./helper');

module.exports.handler = (event, context, callback) => {
  getGroupFromCode(event)
    .then(helper.mapGroupItemsToGroups)
    .then(confirmValidGroupsCode)
    .then(group => mapRequestToUser(group, event))
    .then(user => Promise.all([saveUser(user), updateGroup(user)]) )
    .then(values => helper.mapUserToResponse(values[0]) )
    .then( user => helper.sendSuccess(user, callback) )
    .catch( err => helper.sendError(err, context) );
};

let getGroupFromCode = (event) => {
  const code = event.pathParameters.groupId;
  const params = {
    TableName: process.env.GROUPS_TABLE,
    IndexName: process.env.GROUPS_TABLE_CODE_INDEX,
    KeyConditionExpression: 'code = :code',
    ExpressionAttributeValues: { ':code': code }
  };
  console.log('Getting group with params', params);
  return docs.query(params).promise();
}

let confirmValidGroupsCode = (groups) => {
  return new Promise( (resolve, reject) => groups && groups.length === 1 ? resolve(groups[0]) : reject('No group found'));
}

let mapRequestToUser = (group, request) => {
  let timestamp = new Date().getTime();
  const body = JSON.parse(request.body);
  console.log('Received create user request with params', body, group.groupId);
  return Promise.resolve({
      groupId: group.groupId,
      type: helper.PROFILE_TYPE_PREFIX + body.userId,
      userId: body.userId,
      name: body.name,
      picture: body.picture,
      createdAt: timestamp,
      updatedAt: timestamp
    });
};

let saveUser = (user) => {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: user
  };
  console.log('Creating user with params', params);
  return new Promise( (resolve, reject) => {
    docs.put(params, (err, data) => err ? reject(err) : resolve(user) );
  });
};

let updateGroup = (user) => {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: {
      groupId: user.groupId,
      type: helper.GROUP_TYPE
    },
    UpdateExpression: 'add pictures :pictures',
    ExpressionAttributeValues: { ':pictures': [user.picture] }
  };
  console.log('Updating group picture with params', params);
  return new Promise( (resolve, reject) => {
    docs.update(params, (err, data) => err ? reject(err) : resolve(user) );
  });
};
