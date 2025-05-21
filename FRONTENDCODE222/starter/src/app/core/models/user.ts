import { Role } from './role';

export class User {
  id!: number;
  img!: string;
  email!: string;
  phoneNumber!:number;
  fullName!: string;
  role!: Role;
  token!: string;
  lastModifiedDate!:Date
}

export class AddUser {
  fullName!: string;
  gender!:string;
  phoneNumber!:string;
  role!: Role;
  password!:string;
  address!:string
  email!: string;
  dateOfBirth!:Date;
  img!: string;
}
