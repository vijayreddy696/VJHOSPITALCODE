import { Role } from './role';

export class User {
  id!: number;
  img!: string;
  email!: string;
  fullName!: string;
  role!: Role;
  token!: string;
}
