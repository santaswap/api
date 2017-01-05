'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

module.exports.list = (event, context, callback) => {
    console.log('Getting users by group');

    let groupId = event.pathParameters.groupId;
    
    getUsersByGroup(groupId)
        .then( users => {
            console.log('Got users', users);
            const response = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(users.Items)
        };
        callback(null, response);
    })
    .catch( err => {
        console.log('Error getting users', err);
        callback('Error');
    });
};

var getUsersByGroup = (groupId) => {
    var params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: 'HashKey = :groupId',
        ExpressionAttributeValues: {
            ":groupId": groupId
        }
    };
    console.log('Getting all users with params', params);
    return docs.scan(params).promise();
};
