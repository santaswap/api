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
  mapRequestToGroup(event)
    .then(updateGroup)
    .then(helper.mapGroupToResponse)
    .then( group => helper.sendSuccess(group, callback) )
    .catch( err => helper.sendError(err, context) );
};

const mapRequestToGroup = request => {
  let timestamp = new Date().getTime();
  const body = JSON.parse(request.body);
  const groupId = request.pathParameters.groupId;
  console.log('Received update group request with params', body, groupId);
  return new Promise( resolve => resolve({
      groupId: groupId,
      type: helper.GROUP_TYPE,
      name: body.name,
      rules: body.rules,
      updatedAt: timestamp
    })
  );
};

const updateGroup = group => {
  let expression = getExpression(group);
  const params = {
    TableName: process.env.GROUPS_TABLE,
    Key: {
      groupId: group.groupId,
      type: helper.GROUP_TYPE
    },
    UpdateExpression: expression.updateExpression,
    ExpressionAttributeNames: expression.expressionAttributeNames,
    ExpressionAttributeValues: expression.expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };
  console.log('Updating group with params', params);
  return new Promise( (resolve, reject) => {
    docs.update(params, (err, updated) => err ? reject(err) : resolve(updated.Attributes) );
  });
};

const getExpression = group => {
  let updateExpression = 'set ';
  let expressionAttributeNames = {};
  let expressionAttributeValues = {};
  if(group.name) {
    updateExpression += '#n = :name';
    expressionAttributeNames['#n'] = 'name';
    expressionAttributeValues[':name'] = group.name; 
  }
  if(group.rules) {
    updateExpression ? updateExpression += ', ' : updateExpression += ' ';
    updateExpression += '#r = :rules';
    expressionAttributeNames['#r'] = 'rules';
    expressionAttributeValues[':rules'] = group.rules; 
  }
  if(group.updatedAt) {
    updateExpression ? updateExpression += ', ' : updateExpression += ' ';
    updateExpression += 'updatedAt = :updatedAt';
    expressionAttributeValues[':updatedAt'] = group.updatedAt; 
  }
  return {
    updateExpression: updateExpression,
    expressionAttributeNames: expressionAttributeNames,
    expressionAttributeValues: expressionAttributeValues
  };
};