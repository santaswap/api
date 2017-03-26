'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const helper = require('./helper');

module.exports.handler = (event, context, callback) => {
  mapRequestToProfile(event)
    .then(updateProfile)
    .then(helper.mapProfileToResponse)
    .then( profile => helper.sendSuccess(profile, callback))
    .catch( err => helper.sendError(err, context));
};

const mapRequestToProfile = request => {
  let timestamp = new Date().getTime();
  const profile = JSON.parse(request.body);
  const groupId = request.pathParameters.groupId;
  const profileId = request.pathParameters.profileId;
  console.log('Mapping request to user profile with params', profile);
  return Promise.resolve({
    groupId: groupId,
    type: helper.PROFILE_TYPE_PREFIX + profileId,
    profileId: profileId,
    name: profile.name,
    picture: profile.picture,
    address: profile.address,
    about: profile.about,
    wishlist: profile.wishlist,
    updatedAt: timestamp
  });
};

const updateProfile = profile => {
  let expression = getExpression(profile);
  var params = {
    TableName: process.env.GROUPS_TABLE,
    Key: { 
        groupId: profile.groupId,
        type: profile.type
    },
    UpdateExpression: expression.updateExpression,
    ExpressionAttributeValues: expression.expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };
  console.log('Updating user profile with params', params);
  return new Promise( (resolve, reject) => {
    docs.update(params, (err, updated) => err ? reject(err) : resolve(updated.Attributes) );
  });
};

const getExpression = profile => {
  let updateExpression = 'set ';
  let expressionAttributeValues = {};
  if(profile.about) {
    updateExpression += 'about = :about';
    expressionAttributeValues[':about'] = profile.about; 
  }
  if(profile.address) {
    updateExpression ? updateExpression += ', ' : updateExpression += ' ';
    updateExpression += 'address = :address';
    expressionAttributeValues[':address'] = profile.address; 
  }
  if(profile.wishlist) {
    updateExpression ? updateExpression += ', ' : updateExpression += ' ';
    updateExpression += 'wishlist = :wishlist';
    expressionAttributeValues[':wishlist'] = profile.wishlist; 
  }
  if(profile.updatedAt) {
    updateExpression ? updateExpression += ', ' : updateExpression += ' ';
    updateExpression += 'updatedAt = :updatedAt';
    expressionAttributeValues[':updatedAt'] = profile.updatedAt; 
  }
  return {
    updateExpression: updateExpression,
    expressionAttributeValues: expressionAttributeValues
  };
};
