import { Qualification } from "./qualification.interface";
import { Specialization } from "./specialization";

export interface Doctor {
    id: number;
    img?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender?: string;
    qualificationId: number;
    qualification?: Qualification;
    specializationId: number;
    specialization?: Specialization;
    experience?: number;
  }
  