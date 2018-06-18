import {Group} from './group';
export class Member {
  _id: string;
  name: string;
  mob: string ;
  email: string;
  telegram: string;
  image: string;
  place: string;
  status: string;
  groups: Array<Group>;
  updatedOn: Date;
}
