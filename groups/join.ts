import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { joinGroup } from './group-service';

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const response = await joinGroup(path.groupId, path.userId);
    success(response);
  } catch (err) {
    error(err);
  }
});
