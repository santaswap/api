'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const helper = require('./helper');

module.exports.handler = (event, context, callback) => {
  listGroups()
    .then(helper.mapGroupItemsToGroups)
    .then(helper.mapGroupsToResponse)
    .then(groups => filterGroups(groups, event) )
    .then(groups => helper.sendSuccess(groups, callback) )
    .catch( err => helper.sendError(err, context) );
};

let listGroups = () => {
  var params = {
    TableName: process.env.GROUPS_TABLE
  };
  console.log('Getting all groups with params', params);
  return docs.scan(params).promise();
};

let filterGroups = (groups, event) => {
  const personId = event.pathParameters.personId;
  console.log('Filtering all groups by person', JSON.stringify(groups), personId);
  return new Promise( resolve => resolve(groups.filter(group => {
    console.log(group, group.profiles);
    return group.profiles.some( profile => profile.id === personId);
  })
  )
  );
}