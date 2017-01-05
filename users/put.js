'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10'
});

module.exports.put = (event, context, callback) => {

  let data = JSON.parse(event.body);
  console.log('Updating user', data);
  
  var getUser = (data) => {
    return new Promise( (resolve, reject) => {
      let timestamp = new Date().getTime();

      resolve({
        groupId: event.pathParameters.groupId,
        userId: event.pathParameters.userId,
        bio: data.bio,
        address: data.address,
        updatedAt: timestamp
      });
    });
  }
  
  var updateUser = (user) => {

    let expression = getExpression(user);
    var params = {
      TableName: process.env.TABLE_NAME,
      Key: { 
          userId: user.userId,
          groupId: user.groupId
      },
      UpdateExpression: expression.updateExpression,
      ExpressionAttributeValues: expression.expressionAttributeValues
    };
    console.log('Updating user with params', params);
    return new Promise( (resolve, reject) => {
      docs.update(params, err => err ? reject(err) : resolve(user) );
    });
  };

  var getExpression = (user) => {
    let updateExpression = 'set ';
    let expressionAttributeValues = {};
    if(user.bio) {
      updateExpression += 'bio = :bio';
      expressionAttributeValues[':bio'] = user.bio; 
    }
    if(user.address) {
      updateExpression ? updateExpression += ', ' : updateExpression += ' ';
      updateExpression += 'address = :address';
      expressionAttributeValues[':address'] = user.address; 
    }
    if(user.updatedAt) {
      updateExpression ? updateExpression += ', ' : updateExpression += ' ';
      updateExpression += 'updatedAt = :updatedAt';
      expressionAttributeValues[':updatedAt'] = user.updatedAt; 
    }
    return {
      updateExpression: updateExpression,
      expressionAttributeValues: expressionAttributeValues
    };
  };

  getUser(data)
    .then(updateUser)
    .then( user => {
      console.log('Updated user', user);
      const response = {
        statusCode: 200,
        body: JSON.stringify(user)
      };
      callback(null, response);
    })
    .catch( err => {
      console.log('Error updating user', err);
      callback('Error');
    });
};
