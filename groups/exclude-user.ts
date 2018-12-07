import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { excludeUser } from './group-service';

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const response = await excludeUser(path.groupId, path.userId, path.excludedUserId);
    success(response);
  } catch (err) {
    error(err);
  }
});
