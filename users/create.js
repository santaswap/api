'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10'
});

module.exports.post = (event, context, callback) => {

  let data = JSON.parse(event.body);
  console.log('Creating user', data);

  getUser(data)
    .then(createUser)
    .then( user => {
      console.log('Created user', user);
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(user)
      };
      callback(null, response);
    })
    .catch( err => {
      console.log('Error creating user', err);
      callback('Error');
    });
};

var getUser = (data) => {
  return new Promise( (resolve, reject) => {
    let timestamp = new Date().getTime();

    resolve({
      groupId: event.pathParameters.groupId,
      userId: data.userId,
      bio: data.bio,
      address: data.address,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  });
}

var createUser = (user) => {
  var params = {
    TableName: process.env.TABLE_NAME,
    Item: user
  };
  console.log('Creating user with params', params);
  return new Promise( (resolve, reject) => {
    docs.put(params, (err, data) => err ? reject(err) : resolve(user) );
  });
};
