import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { createAndJoinGroup } from './group-service';
import { CreateGroupRequest } from './group';

export const handler = apiWrapper(async ({ body, path, success, error }: ApiSignature) => {
  try {
    const group = new CreateGroupRequest(body);
    const response = await createAndJoinGroup(group, path.userId);
    success(response);
  } catch (err) {
    error(err);
  }
});
