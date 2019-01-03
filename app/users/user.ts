import { v4 } from 'uuid';

export class CreateUserRequest {
  userId: string;
  name: string;
  created: string;

  constructor(name: string) {
    this.userId = v4();
    this.created = new Date().toUTCString();
    this.name = name;
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
