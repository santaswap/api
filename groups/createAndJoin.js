'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const uuid = require('uuid');
const rand = require('random-number').generator({
  min: 1000,
  max: 9999,
  integer: true
});
const helper = require('./helper');

module.exports.handler = (event, context, callback) => {
  mapRequestToProfile(event)
    .then(saveProfile)
    .then(profile => mapRequestAndProfileToGroup(event, profile))
    .then(saveGroup)
    // TODO get objects from functions above instead of reading immediately after writing
    .then(getGroupItems)
    .then(helper.mapGroupItemsToGroup)
    .then(helper.mapGroupToResponse)
    .then( group => helper.sendSuccess(group, callback) )
    .catch( err => helper.sendError(err, context) );
};

let mapRequestToProfile = (request) => {
  let timestamp = new Date().getTime();
  const body = JSON.parse(request.body);
  const profile = body.profile;
  console.log('Mapping request to user profile with params', profile);
  return Promise.resolve({
    groupId: uuid.v1(),
    type: helper.PROFILE_TYPE_PREFIX + profile.id,
    userId: profile.id,
    name: profile.name,
    picture: profile.picture,
    createdAt: timestamp,
    updatedAt: timestamp
  });
};
 
let mapRequestAndProfileToGroup = (request, profile) => {
  let timestamp = new Date().getTime();
  const body = JSON.parse(request.body);
  let group = body.group;
  console.log('Mapping request to group with params', group, profile);
  return Promise.resolve({
    groupId: profile.groupId,
    type: helper.GROUP_TYPE,
    name: group.name,
    code: rand().toString(),
    rules: 'Be excellent to each other',
    pictures: docs.createSet([profile.picture]),
    matched: false,
    createdAt: timestamp,
    updatedAt: timestamp
  });
};

let saveProfile = (profile) => {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: profile
  };
  console.log('Creating user with params', params);
  return new Promise( (resolve, reject) => {
    docs.put(params, (err, data) => err ? reject(err) : resolve(profile) );
  });
};
  
let saveGroup = (group) => {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Item: group,
  };
  console.log('Creating group with params', params);
  return new Promise( (resolve, reject) => {
    docs.put(params, (err, data) => err ? reject(err) : resolve(group) );
  });
};

let getGroupItems = (group) => {
  const params = {
    TableName: process.env.GROUPS_TABLE,
    KeyConditionExpression: 'groupId = :groupId',
    ExpressionAttributeValues: { ':groupId': group.groupId }
  };
  console.log('Getting group with params', params);
  return docs.query(params).promise();
};
