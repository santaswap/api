import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { getGroupsByUser } from './group-service';

export const handler = apiWrapper(async ({ path, success, error }: ApiSignature) => {
  try {
    const response = await getGroupsByUser(path.userId);
    success(response);
  } catch (err) {
    error(err);
  }
});
