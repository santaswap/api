import { v1 } from 'uuid';

export class Group {
  groupId: string;
  type: string = 'GROUP:';
  name: string;

  constructor(body: any) {
    this.groupId = v1();
    this.type += this.groupId;
    this.name = body.name;
  }
}
