'use strict'
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

module.exports.handler = (event, context, callback) => {    
    userFromParams(event)
        .then(saveUser)
        .then( user => context.done(null, user) )
        .catch( err => {
            console.log('Unexpected error adding user: ', JSON.stringify(err));
            context.done('Unexpected error');
        });
};

var saveUser = (user) => {
    var params = {
        TableName: "User",
        Item: user,
    };
    // Can't use the aws .promise() response because dynamodb.put operation inexplicably doesn't support returning the put object
    return new Promise( (resolve, reject) => {
        docClient.put(params, (err, data) =>  err ? reject(err) : resolve(user) );
    });
};

var generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

var replaceEmptyWithNull = (object) => {
    Object.getOwnPropertyNames(object).forEach( prop => {
        if (object[prop] === '') {
            object[prop] = null;
        }
    });
    return object;
};

var userFromParams = (event) => {
    return new Promise( (resolve, reject) => {
        console.log('Received upsert user request with params: ', event);
        let user = replaceEmptyWithNull(event.data);
        user.id = user.id ? user.id : generateUUID();
        user.created = (new Date()).toString();
        resolve(user);
    });
};