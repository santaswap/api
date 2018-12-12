import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { getDetailedGroupByUser } from './group-service';

export const handler = apiWrapper(async ({ path, success, error }: ApiSignature) => {
  try {
    const response = await getDetailedGroupByUser(path.userId, path.groupId);
    success(response);
  } catch (err) {
    error(err);
  }
});
