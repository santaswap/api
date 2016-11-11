'use strict'
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

module.exports.handler = (event, context, callback) => {
  console.log('Getting users');
  getUsers()
    .then( users => {
      console.log('Got users', JSON.stringify(users));
      console.log('User items', JSON.stringify(users.Items));
      context.done(null, users.Items);
    })
    .catch( err => {
      console.log('Unexpected error getting users: ', JSON.stringify(err));
      context.done('Unexpected error');
  });
  console.log('Finished getting users');
};

var getUsers = () => {
  console.log('Scanning table');
  var params = {
    TableName: 'User'
  };
  return docClient.scan(params).promise();
};