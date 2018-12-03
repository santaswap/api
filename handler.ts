import { apiWrapper, ApiSignature } from '@manwaring/lambda-wrapper';

export const hello = apiWrapper(async ({ event, success }: ApiSignature) => {
  success({
    message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
    input: event
  });
});
