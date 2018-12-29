import { v1 } from 'uuid';

export class CreateUserRequest {
  userId: string;
  name: string;

  constructor(name: string) {
    this.userId = v1();
    this.name = name;
  }
}
