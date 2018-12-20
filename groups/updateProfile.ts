import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { updateProfile } from './group-service';
import { UserProfileUpdateRequest } from './user-profile';

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const { groupId, userId } = path;
    const { name, address, giftIdeas } = body;
    const updateUserProfileRequest = new UserProfileUpdateRequest({ groupId, userId, name, address, giftIdeas });
    const response = await updateProfile(updateUserProfileRequest);
    success(response);
  } catch (err) {
    error(err);
  }
});
