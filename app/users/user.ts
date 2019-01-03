import { v4 } from 'uuid';

export class CreateUserRequest {
  userId: string;
  name: string;
  created: string;
  test: boolean;
  recordExpiration: number;

  constructor(name: string, test: boolean) {
    this.userId = v4();
    this.created = new Date().toUTCString();
    this.name = name;
    this.test = test;
    if (test) {
      const MINUTES_TO_LIVE = 30;
      const MILLISECONDS_TO_LIVE = MINUTES_TO_LIVE * 60 * 1000;
      this.recordExpiration = Math.floor(new Date(Date.now() + MILLISECONDS_TO_LIVE).getTime() / 1000);
    }
  }
}

export class UserResponse {
  userId: string;
  name: string;

  constructor(user: any) {
    this.userId = user.userId;
    this.name = user.name;
  }
}