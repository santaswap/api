'use strict'
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

module.exports.handler = (event, context, callback) => {
  getUsers()
    .then( users => context.done(null, users.Items) )
    .catch( err => {
      console.log('Unexpected error getting users: ', JSON.stringify(err));
      context.done('Unexpected error');
  });
};

var getUsers = () => {
  var params = {
    TableName: 'User'
  };
  return docClient.scan(params).promise();
};