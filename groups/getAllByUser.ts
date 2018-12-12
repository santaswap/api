import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { getAllGroupsByUser } from './group-service';

export const handler = apiWrapper(async ({ path, success, error }: ApiSignature) => {
  try {
    const response = await getAllGroupsByUser(path.userId);
    success(response);
  } catch (err) {
    error(err);
  }
});
