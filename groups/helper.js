'use strict';

const GROUP_TYPE = 'GROUP';
const PROFILE_TYPE_PREFIX = 'PROFILE:';

let mapGroupsToResponse = (groups) => {
  return Promise.all(groups.map(group => mapGroupToResponse(group) ));
}

let mapGroupToResponse = (group) => {
  console.log('Mapping group to response', group);
  return new Promise( resolve => resolve({
      id: group.groupId,
      name: group.name,
      code: group.code,
      rules: group.rules,
      matched: group.matched,
      pictures: group.pictures,
      users: group.users ? mapUsersToResponse(group.users) : []
    })
  );
}

let mapUsersToResponse = (users) => {
  return users.map( user => {
    return {
      groupId: user.groupId,
      id: user.userId,
      name: user.name,
      picture: user.picture,
      address: user.address,
      bio: user.bio
    };
  });
}

let mapUserToResponse = (user) => {
  return new Promise( resolve => resolve({
      groupId: user.groupId,
      id: user.userId,
      name: user.name,
      picture: user.picture,
      address: user.address,
      bio: user.bio
    })
  );
};

let mapGroupItemsToGroup = (groupItems) => {
  let items = groupItems.Items;
  console.log('Mapping group items to group', items);
  let group = items.find(item => item.type === GROUP_TYPE);
  if(group) {
    group.users = items.filter(item => item.type !== GROUP_TYPE);
  }
  return new Promise( resolve => resolve(group));
};

let mapGroupItemsToGroups = (groupsItems) => {
  let items = groupsItems.Items;
  console.log('Mapping groups items to groups', items);
  let groups = items.filter(item => item.type === GROUP_TYPE);
  let users = items.filter(item => item.type !== GROUP_TYPE);
  groups.forEach(group => group.users = users.filter(user => user.groupId === group.groupId) );
  return new Promise( resolve => resolve(groups));
};

let sendSuccess = (group, callback) => {
  console.log('Replying with group', group);
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(group)
  };
  callback(null, response);
};

let sendError = (err, context) => {
  console.log('Unexpected error', err);
  const response = {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: 'Error'
  };
  context.fail(response);
};

module.exports = {
    GROUP_TYPE: GROUP_TYPE,
    PROFILE_TYPE_PREFIX: PROFILE_TYPE_PREFIX,
    mapGroupToResponse: mapGroupToResponse,
    mapGroupsToResponse: mapGroupsToResponse,
    mapGroupItemsToGroup: mapGroupItemsToGroup,
    mapGroupItemsToGroups: mapGroupItemsToGroups,
    mapUserToResponse: mapUserToResponse,
    sendSuccess: sendSuccess,
    sendError: sendError
};
