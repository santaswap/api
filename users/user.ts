import { v1 } from 'uuid';

export class User {
  userId: string;
  name: string;

  constructor(name: string) {
    this.userId = v1();
    this.name = name;
  }
}
