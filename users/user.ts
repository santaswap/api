import { v1 } from 'uuid';

export interface User {
  userId: string;
  name: string;
}

export class CreateUserRequest implements User {
  userId: string;
  name: string;

  constructor(name: string) {
    this.userId = v1();
    this.name = name;
  }
}

export class UserRecord implements User {
  userId: string;
  name: string;
}
