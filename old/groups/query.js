'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const helper = require('./helper');

module.exports.handler = (event, context, callback) => {
  getGroupItems(event)
    .then(helper.mapGroupItemsToGroups)
    .then(helper.mapGroupsToResponse)
    .then( groups => helper.sendSuccess(groups, callback) )
    .catch( err => helper.sendError(err, context) );
};

const getGroupItems = event => {
  console.log('Getting group with query', event.queryStringParameters);
  const code = event.queryStringParameters.code;
  const params = {
    TableName: process.env.GROUPS_TABLE,
    IndexName: process.env.GROUPS_TABLE_CODE_INDEX,
    KeyConditionExpression: 'code = :code',
    ExpressionAttributeValues: { ':code': code }
  };
  console.log('Getting group with params', params);
  return docs.query(params).promise();
};
