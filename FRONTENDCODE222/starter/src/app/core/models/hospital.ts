import { AddUser } from "./user";

export class AddHospital {
    id?: number;              // optional because when creating, it might be assigned by the backend
    hospitalName!: string;
    hospitalAddress!: string;
    ownerDetails!: AddUser ;
}
