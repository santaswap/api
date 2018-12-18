import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';
import { CreateUserRequest } from './user';
import { saveUser } from './user-service';

export const handler = apiWrapper(async ({ body, success, error }: ApiSignature) => {
  try {
    const { name } = body;
    const userToSave = new CreateUserRequest(name);
    const user = await saveUser(userToSave);
    success(user);
  } catch (err) {
    error(err);
  }
});
