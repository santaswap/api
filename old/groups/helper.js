'use strict';

const GROUP_TYPE = 'GROUP';
const PROFILE_TYPE_PREFIX = 'PROFILE:';

const mapGroupsToResponse = groups => {
  return Promise.all(groups.map(group => mapGroupToResponse(group) ));
}

const mapGroupToResponse = group => {
  console.log('Mapping group to response', group);
  return Promise.resolve({
      id: group.groupId,
      name: group.name,
      code: group.code,
      rules: group.rules,
      matched: group.matched,
      pictures: group.pictures && group.pictures.values ? group.pictures.values : [],
      profiles: group.profiles ? mapProfilesToResponse(group.profiles) : []
    });
}

const mapProfilesToResponse = profiles => {
  return profiles.map( profile => {
    return {
      groupId: profile.groupId,
      id: profile.profileId,
      name: profile.name,
      picture: profile.picture,
      address: profile.address,
      about: profile.about,
      wishlist: profile.wishlist
    };
  });
}

const mapProfileToResponse = profile => {
  return Promise.resolve({
      groupId: profile.groupId,
      id: profile.profileId,
      name: profile.name,
      picture: profile.picture,
      address: profile.address,
      about: profile.about,
      wishlist: profile.wishlist
    });
};

const mapGroupItemsToGroup = groupItems => {
  let items = groupItems.Items;
  console.log('Mapping group items to group', items);
  let group = items.find(item => item.type === GROUP_TYPE);
  if(group) {
    group.profiles = items.filter(item => item.type !== GROUP_TYPE);
  }
  return Promise.resolve(group);
};

const mapGroupItemsToGroups = groupsItems => {
  let items = groupsItems.Items;
  console.log('Mapping groups items to groups', items);
  let groups = items.filter(item => item.type === GROUP_TYPE);
  let profiles = items.filter(item => item.type !== GROUP_TYPE);
  groups.forEach(group => group.profiles = profiles.filter(profile => profile.groupId === group.groupId) );
  return Promise.resolve(groups);
};

const sendSuccess = (group, callback) => {
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

const sendError = (err, context) => {
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
    mapProfileToResponse: mapProfileToResponse,
    sendSuccess: sendSuccess,
    sendError: sendError
};
