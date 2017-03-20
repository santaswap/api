'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const helper = require('./helper');

module.exports.handler = (event, context, callback) => {
  getGroupFromCode(event)
    .then(helper.mapGroupItemsToGroups)
    .then(confirmValidGroupsCode)
    .then( group => mapRequestToProfile(group, event))
    .then( profile => Promise.all([saveProfile(profile), updateGroup(profile)]) )
    .then(values => helper.mapGroupToResponse(values[1]) )
    .then( group => helper.sendSuccess(group, callback) )
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

let mapRequestToProfile = (group, request) => {
  let timestamp = new Date().getTime();
  const body = JSON.parse(request.body);
  console.log('Received create user profile request with params', body, group.groupId);
  return Promise.resolve({
      groupId: group.groupId,
      type: helper.PROFILE_TYPE_PREFIX + body.id,
      profileId: body.id,
      name: body.name,
      picture: body.picture,
      createdAt: timestamp,
      updatedAt: timestamp
    });
};

let saveProfile = profile => {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: profile
  };
  console.log('Creating user profile with params', params);
  return new Promise( (resolve, reject) => {
    docs.put(params, (err, data) => err ? reject(err) : resolve(profile) );
  });
};

let updateGroup = profile => {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: {
      groupId: profile.groupId,
      type: helper.GROUP_TYPE
    },
    UpdateExpression: 'add pictures :pictures',
    ExpressionAttributeValues: { ':pictures': docs.createSet([profile.picture]) },
    ReturnValues: 'ALL_NEW'
  };
  console.log('Updating group picture with params', params);
  return new Promise( (resolve, reject) => {
    // docs.update(params, (err, data) => err ? reject(err) : resolve(data) );
    
    docs.update(params, (err, data) => {
      if(err) {
        reject(err);
      } else {
        console.log('Got data back from update', data);
        resolve(data.Attributes);
      }
    });
  });
};
