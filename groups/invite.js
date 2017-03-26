'use strict';
const AWS = require('aws-sdk');
const docs = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
const INTERNATIONAL_FORMAT = require('google-libphonenumber').PhoneNumberFormat.INTERNATIONAL;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const helper = require('./helper');

module.exports.handler = (event, context, callback) => {
  const requestParams = mapRequestToSMSParams(event);
  invite(requestParams)
    .then(response => sendOptOut(requestParams))
    .then(mapResponsesToResponse)
    .then( response => helper.sendSuccess(response, callback) )
    .catch( err => helper.sendError(err, context) );
};

const mapRequestToSMSParams = request => {
  const body = JSON.parse(request.body);
  return {
    number: phoneUtil.format(phoneUtil.parse(body.number, 'US'), INTERNATIONAL_FORMAT),
    inviter: body.inviter,
    group: body.group,
    domain: body.domain
  };
};

const invite = requestParams => {
  const params = {
    Message: `${requestParams.inviter} has invited you to the ${requestParams.group.name} Santa Swap group! Join @ ${requestParams.domain}/join/${requestParams.group.code}`,
    PhoneNumber: requestParams.number
  };
  return sns.publish(params).promise();
};

const sendOptOut = requestParams => {
  const params = {
    Message: `Reply with STOP to opt out from receiving additional text messages from Santa Swap`,
    PhoneNumber: requestParams.number
  };
  return sns.publish(params).promise();
};

// TODO actually implement this check
const mapResponsesToResponse = responses => {
  return Promise.resolve('Successfully sent both text messages');
};
