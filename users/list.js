'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

module.exports.list = (event, context, callback) => {
    console.log('Getting all users');
    
    getUsers()
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

var getUsers = () => {
    var params = {
        TableName: process.env.TABLE_NAME
    };
    console.log('Getting all users with params', params);
    return docs.scan(params).promise();
};
