import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { createAndJoinGroup } from './group-service';
import { Group } from './group';

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const group = new Group(body);
    const response = await createAndJoinGroup(group, path.userId);
    success(response);
  } catch (err) {
    error(err);
  }
});
