import { v1 } from 'uuid';

export class Group {
  groupId: string;
  type: string = 'GROUP';
  name: string;

  constructor(name: string) {
    this.groupId = v1();
    this.name = name;
  }
}
