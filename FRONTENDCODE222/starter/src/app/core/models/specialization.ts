import { Department } from "./department";



export class Specialization {
    id?: number;                        // optional: assigned by backend on creation
    specializationName!: string;       // required
    description?: string;              // optional
    department?: Department;           // optional full object if needed
  }
  