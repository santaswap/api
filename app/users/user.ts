import { v4 } from 'uuid';

export class CreateUserRequest {
  userId: string;
  name: string;
  email: string;
  pictureUrl: string;
  created: string;
  testRequest: boolean;
  recordExpiration: number;

  constructor(body: any, testRequest: boolean) {
    this.userId = body.userId ? body.userId : v4();
    this.created = new Date().toUTCString();
    this.name = body.name;
    this.email = body.email;
    this.pictureUrl = body.pictureUrl;
    this.testRequest = testRequest;
    console.log('test request', testRequest);
    if (testRequest) {
      const MINUTES_TO_LIVE = 30;
      const MILLISECONDS_TO_LIVE = MINUTES_TO_LIVE * 60 * 1000;
      this.recordExpiration = Math.floor(new Date(Date.now() + MILLISECONDS_TO_LIVE).getTime() / 1000);
    }
  }
}

export class UserResponse {
  userId: string;
  name: string;
  pictureUrl: string;
  email: string;

  constructor(user: any) {
    this.userId = user.userId;
    this.name = user.name;
    this.pictureUrl = user.pictureUrl;
    this.email = user.email;
  }
}
