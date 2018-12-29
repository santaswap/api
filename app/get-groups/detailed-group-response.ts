import { ProfileResponse } from './profile-response';
import { Group } from './group';

export class DetailedGroupResponse {
  groupId: string;
  name: string;
  members: ProfileResponse[];
  userProfile: ProfileResponse;

  constructor(group: Group, userProfiles: ProfileResponse[], userProfile: ProfileResponse) {
    this.groupId = group.groupId;
    this.name = group.name;
    this.userProfile = userProfile;
    this.members = userProfiles.filter(up => up.userId !== userProfile.userId);
  }
}
